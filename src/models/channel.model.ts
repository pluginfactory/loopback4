import {Entity, model, property, hasMany} from '@loopback/repository';
import {Video} from './video.model';

@model()
export class Channel extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  title: string;

  @property({
    type: 'array',
    itemType: 'string',
    default: ['all'],
  })
  tags?: string[];

  @property({
    type: 'date',
    required: true,
  })
  createdOn: string;

  @property({
    type: 'date',
    required: true,
  })
  updatedon: string;

  @hasMany(() => Video)
  videos: Video[];

  constructor(data?: Partial<Channel>) {
    super(data);
  }
}

export interface ChannelRelations {
  // describe navigational properties here
}

export type ChannelWithRelations = Channel & ChannelRelations;
