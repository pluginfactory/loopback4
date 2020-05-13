import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  Channel,
  Video,
} from '../models';
import {ChannelRepository} from '../repositories';

export class ChannelVideoController {
  constructor(
    @repository(ChannelRepository) protected channelRepository: ChannelRepository,
  ) { }

  @get('/channels/{id}/videos', {
    responses: {
      '200': {
        description: 'Array of Channel has many Video',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Video)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Video>,
  ): Promise<Video[]> {
    return this.channelRepository.videos(id).find(filter);
  }

  @post('/channels/{id}/videos', {
    responses: {
      '200': {
        description: 'Channel model instance',
        content: {'application/json': {schema: getModelSchemaRef(Video)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Channel.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Video, {
            title: 'NewVideoInChannel',
            exclude: ['id'],
            optional: ['channelId']
          }),
        },
      },
    }) video: Omit<Video, 'id'>,
  ): Promise<Video> {
    return this.channelRepository.videos(id).create(video);
  }

  @patch('/channels/{id}/videos', {
    responses: {
      '200': {
        description: 'Channel.Video PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Video, {partial: true}),
        },
      },
    })
    video: Partial<Video>,
    @param.query.object('where', getWhereSchemaFor(Video)) where?: Where<Video>,
  ): Promise<Count> {
    return this.channelRepository.videos(id).patch(video, where);
  }

  @del('/channels/{id}/videos', {
    responses: {
      '200': {
        description: 'Channel.Video DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Video)) where?: Where<Video>,
  ): Promise<Count> {
    return this.channelRepository.videos(id).delete(where);
  }
}
