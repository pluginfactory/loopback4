import {TokenService} from '@loopback/authentication';
import {inject} from '@loopback/context';
import {
  Count,
  Filter,
  FilterExcludingWhere,
  repository,
  Where
} from '@loopback/repository';
import {
  del, get,
  param,
  patch,
  post,
  requestBody
} from '@loopback/rest';
import {AuthTokenBindings, PasswordHasherBindings, UserServiceBindings} from '../config';
import {User} from '../models';
import {UserRepository} from '../repositories';
import {Credentials} from '../repositories/user.repository';
import {PasswordHasher} from '../services/hash.password.bcrypt';
import {CustomUserService} from '../services/user.service';
import {UserSpecs} from './specs/user.controller.specs';

/**
 * UserController contains the route-model connection by connecting
 * the routes with the model repository.
 * @author gaurav sharma
 * @since 13th May 2020
 */
export class UserController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @inject(PasswordHasherBindings.PASSWORD_HASHER)
    readonly passwordHasher: PasswordHasher,
    @inject(AuthTokenBindings.TOKEN_SERVICE)
    readonly jwtService: TokenService,
    @inject(UserServiceBindings.USER_SERVICE)
    readonly userService: CustomUserService
  ) {}

  /**
   * create/signup a new user
   * @param user
   */
  @post('/users', UserSpecs.create.response)
  async create(@requestBody(UserSpecs.create.request) user: User,): Promise<User> {
    const password = await this.passwordHasher.hashPassword(user.password);
    user.password = password;
    return this.userRepository.createUser(user);
  }


  /**
   * get all users
   * @param filter
   */
  @get('/users', UserSpecs.get.response)
  async find(@param.filter(User) filter?: Filter<User>): Promise<User[]> {
    return this.userRepository.find(filter);
  }

  /**
   * Udpate all users where @param where condition matches
   * @param user
   * @param where
   */
  @patch('/users', UserSpecs.patch.response)
  async updateAll(
    @requestBody(UserSpecs.patch.request) user: User,
    @param.where(User) where?: Where<User>,
  ): Promise<Count> {
    return this.userRepository.updateAll(user, where);
  }

  /**
   * get user by id
   * @param id
   * @param filter
   */
  @get('/users/{id}', UserSpecs.getById.response)
  async findById(
    @param.path.number('id') id: number,
    @param.filter(User, {exclude: 'where'}) filter?: FilterExcludingWhere<User>
  ): Promise<User> {
    return this.userRepository.findById(id, filter);
  }

  /**
   * patch a user by id
   * @param id
   * @param user
   */
  @patch('/users/{id}', UserSpecs.patchById.response)
  async updateById(
    @param.path.number('id') id: number,
    @requestBody(UserSpecs.patchById.request) user: User,
  ): Promise<void> {
    await this.userRepository.updateById(id, user);
  }

  /**
   * deletes a user with id
   * @param id
   */
  @del('/users/{id}', UserSpecs.delete.response)
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.userRepository.deleteById(id);
  }

  /**
   * user authentication
   */
  @post('/users/authenticate', UserSpecs.authentication.response)
  async authenticate(@requestBody(UserSpecs.authentication.request) credentials: Credentials): Promise<{token: string}> {
    const user = await this.userRepository.getUserByCredential(credentials);
    const userProfile = this.userService.convertToUserProfile(user);
    const token = await this.jwtService.generateToken(userProfile);

    return {token};
  }
}
