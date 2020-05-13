import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {Channel, ChannelRelations, Video} from '../models';
import {PostgresDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {VideoRepository} from './video.repository';

export class ChannelRepository extends DefaultCrudRepository<
  Channel,
  typeof Channel.prototype.id,
  ChannelRelations
> {

  public readonly videos: HasManyRepositoryFactory<Video, typeof Channel.prototype.id>;

  constructor(
    @inject('datasources.postgres') dataSource: PostgresDataSource, @repository.getter('VideoRepository') protected videoRepositoryGetter: Getter<VideoRepository>,
  ) {
    super(Channel, dataSource);
    this.videos = this.createHasManyRepositoryFactoryFor('videos', videoRepositoryGetter,);
    this.registerInclusionResolver('videos', this.videos.inclusionResolver);
  }
}
