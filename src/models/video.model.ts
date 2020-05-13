import {Entity, model, property} from '@loopback/repository';

@model()
export class Video extends Entity {
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
  url: string;

  @property({
    type: 'string',
    required: true,
  })
  mime: string;

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

  @property({
    type: 'number',
  })
  ref?: number;

  constructor(data?: Partial<Video>) {
    super(data);
  }
}

export interface VideoRelations {
  // describe navigational properties here
}

export type VideoWithRelations = Video & VideoRelations;
