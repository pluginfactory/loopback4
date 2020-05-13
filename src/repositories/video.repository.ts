import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {Video, VideoRelations, Channel} from '../models';
import {PostgresDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {ChannelRepository} from './channel.repository';

export class VideoRepository extends DefaultCrudRepository<
  Video,
  typeof Video.prototype.id,
  VideoRelations
> {

  public readonly channel: BelongsToAccessor<Channel, typeof Video.prototype.id>;

  constructor(
    @inject('datasources.postgres') dataSource: PostgresDataSource, @repository.getter('ChannelRepository') protected channelRepositoryGetter: Getter<ChannelRepository>,
  ) {
    super(Video, dataSource);
    this.channel = this.createBelongsToAccessorFor('channel', channelRepositoryGetter,);
    this.registerInclusionResolver('channel', this.channel.inclusionResolver);
  }
}
