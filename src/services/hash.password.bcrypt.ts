const {hash, genSalt, compare} = require('bcryptjs');
import {inject} from '@loopback/core';
import {PasswordHasherBindings} from '../config';

/**
 * Service HashPassword using module 'bcryptjs'.
 * It takes in a plain password, generates a salt with given
 * round and returns the hashed password as a string
 */
export type HashPassord = {
  password: string,
  rounds: number,
};
// bind function to `services.bcryptjs.HashPassword
export async function hashPassword(
  password: string,
  rounds: number
): Promise<string> {
  const salt = await genSalt(rounds);
  return hash(password, salt);
}


/**
 * Hashing password function using bcrypt.js
 */
export interface PasswordHasher<T = string> {
  hashPassword(password: T): Promise<T>,
  /**
   * The compare function to password validation
   * @param {T} providedPass the input password via API
   * @param {T} storedPass hashed password from db
   */
  comparePassword(providedPass: T, storedPass: T): Promise<boolean>,
}

/**
 * The hasher implements the Password hasher
 */
export class BcryptHasher implements PasswordHasher<string> {
  constructor(
    @inject(PasswordHasherBindings.ROUNDS) private readonly rounds: number
  ) {}

  /**
   * Overriden hashPassword method
   * @param {String} password
   */
  async hashPassword(password: string): Promise<string> {
    const salt = await genSalt(this.rounds);
    return hash(password, salt);
  }

  /**
   * Overriden method to compare hashses
   * @param providedPass
   * @param storedPass
   */
  async comparePassword(providedPass: string, storedPass: string): Promise<boolean> {
    const passwordMatched = await compare(providedPass, storedPass);
    return passwordMatched;
  }
}
