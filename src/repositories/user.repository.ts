import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {PostgresDataSource} from '../datasources';
import {User, UserRelations} from '../models';

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id,
  UserRelations
  > {

  constructor(
    @inject('datasources.postgres') dataSource: PostgresDataSource,
  ) {
    super(User, dataSource);
  }

  /**
   * Overriding method to check email uniqueness with proper response
   * @param {User} user
   */
  async createUser(user: User): Promise<User> {
    const date = new Date().toDateString();
    user.createdOn = date;
    user.lastUpdated = date;
    user.email = user.email.toLocaleLowerCase();
    const emailTaken = await this.findOne({where: {email: user.email}});
    if (emailTaken) {
      throw new HttpErrors.UnprocessableEntity('Email is already taken');
    }
    return this.create(user);
  }
}
