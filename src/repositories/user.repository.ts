import {Getter, inject} from '@loopback/core';
import {DefaultCrudRepository, HasManyRepositoryFactory, repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {PostgresDataSource} from '../datasources';
import {User, UserRelations, Video} from '../models';
import {VideoRepository} from './video.repository';

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id,
  UserRelations
  > {

  public readonly videos: HasManyRepositoryFactory<Video, typeof User.prototype.id>;

  constructor(
    @inject('datasources.postgres') dataSource: PostgresDataSource, @repository.getter('VideoRepository') protected videoRepositoryGetter: Getter<VideoRepository>,
  ) {
    super(User, dataSource);
    this.videos = this.createHasManyRepositoryFactoryFor('videos', videoRepositoryGetter,);
    this.registerInclusionResolver('videos', this.videos.inclusionResolver);
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
