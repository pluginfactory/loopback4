import {DefaultCrudRepository} from '@loopback/repository';
import {Video, VideoRelations} from '../models';
import {PostgresDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class VideoRepository extends DefaultCrudRepository<
  Video,
  typeof Video.prototype.id,
  VideoRelations
> {
  constructor(
    @inject('datasources.postgres') dataSource: PostgresDataSource,
  ) {
    super(Video, dataSource);
  }
}
