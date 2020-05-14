import {asAuthStrategy, AuthenticationStrategy, TokenService} from '@loopback/authentication';
import {bind, inject} from '@loopback/core';
import {asSpecEnhancer, HttpErrors, mergeSecuritySchemeToSpec, OASEnhancer, OpenApiSpec, RedirectRoute, Request} from '@loopback/rest';
import {UserProfile} from '@loopback/security';
import {AuthTokenBindings} from '../config';

@bind(asAuthStrategy, asSpecEnhancer)
export class JWTAuthenticationStrategy implements AuthenticationStrategy, OASEnhancer {
	name = 'jwt'

	constructor(
		@inject(AuthTokenBindings.TOKEN_SERVICE) readonly tokenService: TokenService
	) {}

	async authenticate(request: Request): Promise<UserProfile | RedirectRoute | undefined> {
		const token: string = this.extractCredentials(request);
		const userProfile: UserProfile = await this.tokenService.verifyToken(token);
		return userProfile;
	}

	extractCredentials(request: Request): string {
		// const {Authorization} = request.headers;
		if (!request.headers.authorization) {
			throw new HttpErrors.Unauthorized('Authorization header not found.');
		}
		const authorization = request.headers.authorization;
		if (!authorization?.startsWith('Bearer')) {
			throw new HttpErrors.Unauthorized('Authorization header is not of type bearer');
		}
		const parts = authorization.split(' ');

		if (parts.length !== 2) {
			throw new HttpErrors.Unauthorized(`Authorization header value has too many parts. It must follow the pattern: 'Bearer xx.yy.zz' where xx.yy.zz is a valid JWT token.`);
		}

		const token = parts[1];
		return token;
	}

	modifySpec(spec: OpenApiSpec): OpenApiSpec {
		return mergeSecuritySchemeToSpec(spec, this.name, {
			type: 'http',
			scheme: 'bearer',
			bearerFormat: 'JWT',
		});
	}
}
