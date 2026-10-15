import path from 'node:path';
import { fileURLToPath } from 'node:url';
import swaggerJsdoc from 'swagger-jsdoc';

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));

const swaggerOptions = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Belajar Backend API',
      version: '1.0.0',
      description: 'API documentation for Belajar Backend.',
    },
    servers: [{ url: '/api', description: 'Current server' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        ApiResponse: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'success' },
            message: { type: 'string', example: 'Request successful' },
            data: {
              nullable: true,
              description: 'Response payload; null when no data is returned.',
            },
          },
          required: ['status', 'message', 'data'],
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'fail' },
            message: { type: 'string', example: 'Invalid request' },
          },
          required: ['status', 'message'],
        },
      },
    },
  },
  apis: [path.join(currentDirectory, '../routes/**/*.js')],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

export default swaggerSpec;
