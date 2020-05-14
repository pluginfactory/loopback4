import {TokenService} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import {securityId, UserProfile} from '@loopback/security';
import {promisify} from 'util';
import {AuthTokenBindings} from '../config';
const jwt = require('jsonwebtoken');

const signAsync = promisify(jwt.sign);
const verifyAsync = promisify(jwt.verify);

export class JWTService implements TokenService {
	constructor(
		@inject(AuthTokenBindings.TOKEN_SECRET) private secret: string,
		@inject(AuthTokenBindings.TOKEN_EXPIRES_IN) private expiry: string,
	) {}

	/**
	 * function to verify the jwt token
	 * @param token
	 */
	async verifyToken(token: string): Promise<UserProfile> {
		if (!token) {
			throw new HttpErrors.Unauthorized('Error veryfying token: token is null');
		}

		let userProfile: UserProfile;

		try {
			const decodedToken = await verifyAsync(token, this.secret);
			userProfile = Object.assign(
				{[securityId]: '', name: ''},
				{
					[securityId]: decodedToken.id,
					name: decodedToken.name,
					id: decodedToken.id,
					dob: decodedToken.dob,
					// roles: decodedToken.roles,
				}
			);
		} catch (error) {
			throw new HttpErrors.Unauthorized(`Error verifying token: ${error.message}`)
		}
		return userProfile;
	}

	/**
	 * trigger generating the jwt token
	 * @param userProfile
	 */
	async generateToken(userProfile: UserProfile): Promise<string> {
		if (!userProfile) {
			throw new HttpErrors.Unauthorized('Error generating token: user profile is null');
		}
		const user = {
			id: userProfile[securityId],
			name: userProfile.name,
			dob: userProfile.dob,
		};

		let token: string;
		try {
			token = await signAsync(user, this.secret, {expiresIn: Number(this.expiry)});
		} catch (error) {
			throw new HttpErrors.Unauthorized(`Error generating token: ${error.message}`);
		}
		return token;
	}
}
