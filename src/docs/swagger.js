import {
  OpenAPIRegistry,
  OpenApiGeneratorV3,
} from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import {
  changePasswordBodySchema,
  loginBodySchema,
  resetPasswordBodySchema,
  resetPasswordParamsSchema,
} from '../validator/auth.validator.js';

const registry = new OpenAPIRegistry();

registry.registerComponent('securitySchemes', 'bearerAuth', {
  type: 'http',
  scheme: 'bearer',
  bearerFormat: 'JWT',
});

const jsonResponse = (description, schema) => ({
  description,
  content: {
    'application/json': { schema },
  },
});

const successResponseSchema = (dataSchema) =>
  z.object({
    status: z.literal('success'),
    message: z.string(),
    data: dataSchema,
  });

const emptySuccessResponseSchema = successResponseSchema(z.null()).openapi(
  'EmptySuccessResponse'
);

const errorResponseSchema = z
  .object({
    status: z.enum(['fail', 'error']),
    message: z.string(),
  })
  .openapi('ErrorResponse');

const errorResponse = (description) =>
  jsonResponse(description, errorResponseSchema);

const loginSuccessSchema = successResponseSchema(
  z.object({
    token: z.string(),
    tokenType: z.literal('Bearer'),
    user: z.object({
      id: z.string().uuid(),
      username: z.string(),
      role: z.enum(['ADMIN', 'KEPALA_SEKOLAH', 'GURU', 'STAF']),
      guruId: z.string().uuid().nullable(),
      createdAt: z.string().datetime(),
      updatedAt: z.string().datetime(),
    }),
  })
);

registry.registerPath({
  method: 'post',
  path: '/v1/auth/login',
  summary: 'Log in with username and password',
  tags: ['Authentication'],
  request: {
    body: {
      content: { 'application/json': { schema: loginBodySchema } },
    },
  },
  responses: {
    200: jsonResponse('Login successful.', loginSuccessSchema),
    400: errorResponse('Invalid request body.'),
    401: errorResponse('Username or password is incorrect.'),
  },
});

registry.registerPath({
  method: 'post',
  path: '/v1/auth/logout',
  summary: 'Log out',
  description:
    'Client must discard its bearer token. The stateless JWT remains valid until it expires.',
  tags: ['Authentication'],
  security: [{ bearerAuth: [] }],
  responses: {
    200: jsonResponse('Logout response.', emptySuccessResponseSchema),
    401: errorResponse('Missing or invalid bearer token.'),
  },
});

registry.registerPath({
  method: 'post',
  path: '/v1/auth/forgot-password',
  summary: 'Get instructions for resetting a password',
  description:
    'Password reset is handled by an administrator; this endpoint does not send email.',
  tags: ['Authentication'],
  responses: {
    200: jsonResponse(
      'Instructions to contact an administrator.',
      emptySuccessResponseSchema
    ),
  },
});

registry.registerPath({
  method: 'patch',
  path: '/v1/auth/password',
  summary: "Change the current user's password",
  tags: ['Authentication'],
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': { schema: changePasswordBodySchema },
      },
    },
  },
  responses: {
    200: jsonResponse(
      'Password changed successfully.',
      emptySuccessResponseSchema
    ),
    400: errorResponse('Invalid request body.'),
    401: errorResponse('Missing/invalid token or incorrect current password.'),
  },
});

registry.registerPath({
  method: 'patch',
  path: '/v1/auth/users/{userId}/password',
  summary: "Reset a user's password as an administrator",
  tags: ['Authentication'],
  security: [{ bearerAuth: [] }],
  request: {
    params: resetPasswordParamsSchema,
    body: {
      content: { 'application/json': { schema: resetPasswordBodySchema } },
    },
  },
  responses: {
    200: jsonResponse(
      'User password reset successfully.',
      emptySuccessResponseSchema
    ),
    400: errorResponse('Invalid user ID or request body.'),
    401: errorResponse('Missing or invalid bearer token.'),
    403: errorResponse('Only administrators can reset user passwords.'),
    404: errorResponse('User not found.'),
  },
});

const generator = new OpenApiGeneratorV3(registry.definitions);

const swaggerSpec = generator.generateDocument({
  openapi: '3.0.3',
  info: {
    title: 'Belajar Backend API',
    version: '1.0.0',
    description: 'API documentation for Belajar Backend.',
  },
  servers: [{ url: '/api', description: 'Current server' }],
});

export default swaggerSpec;
