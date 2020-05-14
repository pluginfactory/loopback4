import {UserService} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {securityId, UserProfile} from '@loopback/security';
import {PasswordHasherBindings} from '../config';
import {User} from '../models';
import {Credentials, UserRepository} from '../repositories';
import {PasswordHasher} from './hash.password.bcrypt';

export class CustomUserService implements UserService<User, Credentials> {
	constructor(
		@repository(UserRepository) readonly userRepository: UserRepository,
		@inject(PasswordHasherBindings.PASSWORD_HASHER) readonly passwordHasher: PasswordHasher
	) {}

	/**
	 * verify incoming credentials
	 * @param credentials
	 */
	async verifyCredentials(credentials: Credentials): Promise<User> {
		const invalidCredentialsError = 'Invalid email or password';

		const user = await this.userRepository.findOne({where: {email: credentials.email}});
		if (!user) {
			throw new HttpErrors.Unauthorized(invalidCredentialsError);
		}

		const passwordMatched = await this.passwordHasher.comparePassword(
			credentials.password,
			user.password
		);

		if (!passwordMatched) {
			throw new HttpErrors.Unauthorized(invalidCredentialsError);
		}

		return user;
	}

	convertToUserProfile(user: User): UserProfile {
		if (!user) {
			throw new HttpErrors.Unauthorized('');
		}
		const userProfile = {
			[securityId]: user.id ? user.id.toString() : user.email,
			name: user.name,
			dob: user.dob,
		}
		return userProfile;
	}
}
