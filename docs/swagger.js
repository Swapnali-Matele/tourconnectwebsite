const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Tour Connect API',
      version: '1.0.0',
      description: 'Backend API for Tour Connect assignment.'
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Local development server'
      }
    ],
    components: {
      schemas: {
        Tour: {
          type: 'object',
          required: ['tour_id', 'title', 'description', 'pick_up', 'meeting_point', 'drop_off'],
          properties: {
            tour_id: {
              type: 'integer',
              example: 50872
            },
            title: {
              type: 'string',
              example: 'Description of Tour'
            },
            description: {
              type: 'string',
              example: 'A wonderful tour experience'
            },
            pick_up: {
              type: 'string',
              example: 'Hotel Lobby'
            },
            meeting_point: {
              type: 'string',
              example: 'Central Bus Station'
            },
            drop_off: {
              type: 'string',
              example: 'Beach Resort'
            },
            duration: {
              type: 'number',
              example: 2.5
            },
            duration_unit: {
              type: 'string',
              enum: ['days', 'hours', 'weeks', 'months'],
              example: 'days'
            },
            image: {
              type: 'string',
              example: 'https://example.com/tour.jpg'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        ValidationError: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Validation failed' },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: { type: 'string' },
                  message: { type: 'string' }
                }
              }
            }
          }
        }
      }
    }
  },
  apis: ['./routes/*.js']
};

module.exports = swaggerJsdoc(options);
