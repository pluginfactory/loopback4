import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {User, UserRelations, Video} from '../models';
import {PostgresDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
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
}
