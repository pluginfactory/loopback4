import {TokenService, UserService} from '@loopback/authentication';
import {BindingKey} from '@loopback/core';
import {User} from '../models';
import {Credentials} from '../repositories';
import {PasswordHasher} from '../services/hash.password.bcrypt';

/**
 * This is the keys/values/secrets key file
 */
export namespace PasswordHasherBindings {
  export const PASSWORD_HASHER = BindingKey.create<PasswordHasher>('services.hasher');
  export const ROUNDS = BindingKey.create<number>('services.hasher.round');
}

export namespace TokenServiceConstants {
  export const TOKEN_SECRET_VALUE = process.env.secret ?? 'm@YTh3F0Rc3bEW!thY0u';
  export const TOKEN_EXPIRES_IN_VALUE = '600';
}

// custom namespace bindings for authentication
export namespace AuthTokenBindings {
  export const TOKEN_SECRET = BindingKey.create<string>('auth.jwt.secret');
  export const TOKEN_EXPIRES_IN = BindingKey.create<string>('auth.jwt.expiry');
  export const TOKEN_SERVICE = BindingKey.create<TokenService>('auth.jwt.tokenservice');
}

export namespace UserServiceBindings {
  export const USER_SERVICE = BindingKey.create<UserService<User, Credentials>>('services.user.service')
}
