import {BindingKey} from '@loopback/core';
import {PasswordHasher} from '../services/hash.password.bcrypt';

/**
 * This is the keys/values/secrets key file
 */
export namespace PasswordHasherBindings {
  export const PASSWORD_HASHER = BindingKey.create<PasswordHasher>('services.hasher');
  export const ROUNDS = BindingKey.create<number>('services.hasher.round');
}
