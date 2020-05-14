/**
 * @description this is the spec file for user controller
 * @since 14th May 2020
 * @author gaurav sharma
 */

import {CountSchema} from '@loopback/repository';
import {getModelSchemaRef} from '@loopback/rest';
import {User} from '../../models';

export const UserSpecs = {
	create: {
		request: {
			description: 'The signup/user create function',
			content: {
				'application/json': {
					schema: getModelSchemaRef(User, {
						title: 'NewUser',
						exclude: ['createdOn', 'lastUpdated', 'deleted', 'id'],
						optional: ['dob']
					}),
				}
			}
		},
		response: {
			responses: {
				'200': {
					description: 'User model instance',
					content: {'application/json': {schema: getModelSchemaRef(User)}},
				},
			},
		}
	},
	get: {
		response: {
			responses: {
				'200': {
					description: 'Array of User model instances',
					content: {
						'application/json': {
							schema: {
								type: 'array',
								items: getModelSchemaRef(User, {includeRelations: true}),
							},
						},
					},
				},
			},
		}
	},
	patch: {
		request: {
			content: {
				'application/json': {
					schema: getModelSchemaRef(User, {partial: true}),
				},
			},
		},
		response: {
			responses: {
				'200': {
					description: 'User PATCH success count',
					content: {'application/json': {schema: CountSchema}},
				},
			},
		}
	},
	getById: {
		request: {},
		response: {
			responses: {
				'200': {
					description: 'User model instance',
					content: {
						'application/json': {
							schema: getModelSchemaRef(User, {includeRelations: true}),
						},
					},
				},
			},
		}
	},
	patchById: {
		request: {
			content: {
				'application/json': {
					schema: getModelSchemaRef(User, {partial: true}),
				},
			},
		},
		response: {
			responses: {
				'204': {
					description: 'User PATCH success',
				},
			},
		},
	},
	delete: {
		request: {},
		response: {
			responses: {
				'204': {
					description: 'User DELETE success',
				},
			},
		},
	},
	authentication: {
		request: {
			description: 'The authentication function request body',
			required: true,
			content: {
				'application/json': {
					schema: {
						type: 'object',
						required: ['email', 'password'],
						properties: {
							email: {
								type: 'string',
								format: 'email',
							},
							password: {
								type: 'string',
								// minLength: 8,
							}
						}
					}
				}
			}
		},
		response: {
			responses: {
				'200': {
					description: 'Authnticating the user with email and password',
					content: {
						'application/json': {
							schema: getModelSchemaRef(User)
						}
					}
				}
			}
		}
	},
	whoami: {
		request: {},
		response: {
			responses: {
				'200': {
					description: 'The current user profile',
					content: {
						'application/json': {
							schema: User
						},
					},
				},
			}
		}
	},
};

// /**
//  * Manually define the request body of user login
//  */
// const CredentialsSchema = {
// 	type: 'object',
// 	required: ['email', 'password'],
// 	properties: {
// 		email: {
// 			type: 'string',
// 			format: 'email',
// 		},
// 		password: {
// 			type: 'string',
// 			// minLength: 8,
// 		}
// 	}
// };

// /**
//  * The requst body spec for authentication model for user
//  */
// export const CredentialsRequestBody = {
// 	description: 'The authentication function request body',
// 	required: true,
// 	content: {
// 		'application/json': {schema: CredentialsSchema}
// 	}
// };
