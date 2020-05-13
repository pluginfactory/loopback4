import {Entity, model, property} from '@loopback/repository';

@model({
  settings: {
    hiddenProperties: ['password'],// props hidden from response
    scope: {  // scope applies to each query
      limit: 30,
      where: {deleted: false}
    }
  }
})
export class User extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      format: 'email',
      minLength: 5,
      maxLength: 50,
      transform: ['toLowerCase'],
    },
    index: {
      unique: true,
    },
  })
  email: string;

  @property({
    type: 'string',
  })
  name?: string;

  @property({
    type: 'string',
    required: true,
  })
  password: string;

  @property({
    type: 'date',
    required: true,
  })
  createdOn: string;

  @property({
    type: 'date',
    required: true,
  })
  lastUpdated: string;

  @property({type: 'string', required: false}) dob: string;
  @property({type: 'boolean', default: false}) deleted: boolean;

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}
export type UserWithRelations = User & UserRelations;
