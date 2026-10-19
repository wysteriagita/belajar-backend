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
import {
  studentBody,
  studentIdParamsSchema,
  studentListQuerySchema,
  studentNikParamsSchema,
  studentNisnParamsSchema,
  studentNisParamsSchema,
  studentNomorKkParamsSchema,
  studentUpdateBodySchema,
} from '../validator/student.validator.js';

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

const studentResponseSchema = z
  .object({
    id: z.string().uuid(),
    nisn: z.string(),
    nis: z.string(),
    nik: z.string().nullable().openapi({
      description: 'Masked NIK; only the last 4 digits are visible.',
    }),
    nomorKk: z.string().nullable().openapi({
      description:
        'Masked family card number; only the last 4 digits are visible.',
    }),
    nama: z.string(),
    jenisKelamin: z.enum(['LAKI_LAKI', 'PEREMPUAN']),
    tempatLahir: z.string(),
    tanggalLahir: z.string().datetime(),
    agama: z.enum([
      'ISLAM',
      'KRISTEN',
      'KATOLIK',
      'HINDU',
      'BUDDHA',
      'KONGHUCU',
    ]),
    alamat: z.string(),
    rt: z.string().nullable(),
    rw: z.string().nullable(),
    kelurahan: z.string().nullable(),
    kecamatan: z.string().nullable(),
    kabupaten: z.string().nullable(),
    provinsi: z.string().nullable(),
    kodePos: z.string().nullable(),
    telepon: z.string().nullable(),
    email: z.string().nullable(),
    status: z.enum(['AKTIF', 'LULUS', 'MUTASI', 'DROP_OUT']),
    orangTuaId: z.string().uuid().nullable(),
    waliId: z.string().uuid().nullable(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  })
  .openapi('Student', {
    description:
      'NIK and family card number are masked in standard responses (only the last 4 digits are visible). Nullable database fields are returned as null when unset. Sensitive values are encrypted at rest.',
  });

const studentSuccessResponseSchema = successResponseSchema(
  studentResponseSchema
);
const studentArrayResponseSchema = successResponseSchema(
  z.array(studentResponseSchema)
);
const studentListResponseSchema = z
  .object({
    status: z.literal('success'),
    message: z.string(),
    data: z.array(studentResponseSchema),
    pagination: z.object({
      page: z.number(),
      limit: z.number(),
      totalItem: z.number(),
      totalPages: z.number(),
      hasNextPage: z.boolean(),
      hasPrevPage: z.boolean(),
    }),
  })
  .openapi('StudentListResponse');
const studentPiiResponseSchema = successResponseSchema(
  studentResponseSchema.extend({
    nik: z.string().nullable(),
    nomorKk: z.string().nullable(),
  })
).openapi('StudentPiiResponse');

const studentQueryParams = studentListQuerySchema;
const studentIdParams = studentIdParamsSchema;

registry.registerPath({
  method: 'get',
  path: '/v1/students',
  summary: 'List students',
  description:
    'Returns students that have not been soft-deleted; this includes every student status. NIK and family card number are masked (only the last 4 digits are visible). Search covers name, NIS, and NISN.',
  tags: ['Students'],
  security: [{ bearerAuth: [] }],
  request: { query: studentQueryParams },
  responses: {
    200: jsonResponse(
      'Students retrieved successfully.',
      studentListResponseSchema
    ),
    401: errorResponse('Missing or invalid bearer token.'),
    400: errorResponse('Invalid query parameters.'),
  },
});

registry.registerPath({
  method: 'post',
  path: '/v1/students',
  summary: 'Create a student',
  description: 'NIK and KK are encrypted before being stored.',
  tags: ['Students'],
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: { 'application/json': { schema: studentBody } },
    },
  },
  responses: {
    201: jsonResponse(
      'Student created successfully.',
      studentSuccessResponseSchema
    ),
    400: errorResponse('Invalid student data.'),
    401: errorResponse('Missing or invalid bearer token.'),
    409: errorResponse(
      'A student with the provided unique data already exists.'
    ),
  },
});

registry.registerPath({
  method: 'get',
  path: '/v1/students/by-nisn/{nisn}',
  summary: 'Get a student by NISN',
  tags: ['Students'],
  security: [{ bearerAuth: [] }],
  request: { params: studentNisnParamsSchema },
  responses: {
    200: jsonResponse(
      'Student retrieved successfully.',
      studentSuccessResponseSchema
    ),
    400: errorResponse('NISN must contain exactly 10 digits.'),
    401: errorResponse('Missing or invalid bearer token.'),
    404: errorResponse('Student not found.'),
  },
});

registry.registerPath({
  method: 'get',
  path: '/v1/students/by-nis/{nis}',
  summary: 'Get a student by NIS',
  tags: ['Students'],
  security: [{ bearerAuth: [] }],
  request: { params: studentNisParamsSchema },
  responses: {
    200: jsonResponse(
      'Student retrieved successfully.',
      studentSuccessResponseSchema
    ),
    400: errorResponse('NIS must contain exactly 10 digits.'),
    401: errorResponse('Missing or invalid bearer token.'),
    404: errorResponse('Student not found.'),
  },
});

registry.registerPath({
  method: 'get',
  path: '/v1/students/by-nik/{nik}',
  summary: 'Find a student by NIK',
  description:
    'Administrator only. Search uses a keyed hash; returned NIK remains masked.',
  tags: ['Students'],
  security: [{ bearerAuth: [] }],
  request: { params: studentNikParamsSchema },
  responses: {
    200: jsonResponse(
      'Student retrieved successfully.',
      studentSuccessResponseSchema
    ),
    400: errorResponse('NIK must contain exactly 16 digits.'),
    401: errorResponse('Missing or invalid bearer token.'),
    403: errorResponse('Only administrators can search by NIK.'),
    404: errorResponse('Student not found.'),
  },
});

registry.registerPath({
  method: 'get',
  path: '/v1/students/by-nomor-kk/{nomorKk}',
  summary: 'Find students by family card number',
  description:
    'Administrator only. Multiple students may share the same family card number.',
  tags: ['Students'],
  security: [{ bearerAuth: [] }],
  request: { params: studentNomorKkParamsSchema },
  responses: {
    200: jsonResponse(
      'Students retrieved successfully.',
      studentArrayResponseSchema
    ),
    400: errorResponse('Family card number must contain exactly 16 digits.'),
    401: errorResponse('Missing or invalid bearer token.'),
    403: errorResponse('Only administrators can search by family card number.'),
  },
});

registry.registerPath({
  method: 'get',
  path: '/v1/students/{id}/decry',
  summary: 'Get unmasked student NIK and KK',
  description:
    'Administrator only. Returns NIK and family card number in plaintext after decrypting them. Other student fields match the standard student response.',
  tags: ['Students'],
  security: [{ bearerAuth: [] }],
  request: { params: studentIdParams },
  responses: {
    200: jsonResponse(
      'Sensitive student data retrieved.',
      studentPiiResponseSchema
    ),
    400: errorResponse('Invalid student ID.'),
    401: errorResponse('Missing or invalid bearer token.'),
    403: errorResponse('Only administrators can view student NIK and KK.'),
    404: errorResponse('Student not found.'),
  },
});

registry.registerPath({
  method: 'get',
  path: '/v1/students/{id}',
  summary: 'Get a student by ID',
  description: 'NIK and KK values are masked in the response.',
  tags: ['Students'],
  security: [{ bearerAuth: [] }],
  request: { params: studentIdParams },
  responses: {
    200: jsonResponse(
      'Student retrieved successfully.',
      studentSuccessResponseSchema
    ),
    400: errorResponse('Invalid student ID.'),
    401: errorResponse('Missing or invalid bearer token.'),
    404: errorResponse('Student not found.'),
  },
});

registry.registerPath({
  method: 'patch',
  path: '/v1/students/{id}',
  summary: 'Update a student',
  description:
    'Provide one or more student fields. NIK and KK are encrypted before being stored.',
  tags: ['Students'],
  security: [{ bearerAuth: [] }],
  request: {
    params: studentIdParams,
    body: {
      content: { 'application/json': { schema: studentUpdateBodySchema } },
    },
  },
  responses: {
    200: jsonResponse(
      'Student updated successfully.',
      studentSuccessResponseSchema
    ),
    400: errorResponse('Invalid student ID or request body.'),
    401: errorResponse('Missing or invalid bearer token.'),
    404: errorResponse('Student not found.'),
    409: errorResponse(
      'A student with the provided unique data already exists.'
    ),
  },
});

registry.registerPath({
  method: 'delete',
  path: '/v1/students/{id}',
  summary: 'Soft delete a student',
  tags: ['Students'],
  security: [{ bearerAuth: [] }],
  request: { params: studentIdParams },
  responses: {
    200: jsonResponse(
      'Student deleted successfully.',
      studentSuccessResponseSchema
    ),
    400: errorResponse('Invalid student ID.'),
    401: errorResponse('Missing or invalid bearer token.'),
    404: errorResponse('Student not found.'),
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
