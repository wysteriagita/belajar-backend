import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

const studentIdParamsSchema = z
  .object({
    id: z
      .string()
      .uuid()
      .openapi({
        param: { name: 'id', in: 'path' },
      }),
  })
  .openapi('StudentIdParams');

const studentNisnParamsSchema = z
  .object({
    nisn: z
      .string()
      .regex(/^\d{10}$/)
      .openapi({
        param: { name: 'nisn', in: 'path' },
      }),
  })
  .openapi('StudentNisnParams');

const studentNisParamsSchema = z
  .object({
    nis: z
      .string()
      .regex(/^\d{10}$/)
      .openapi({
        param: { name: 'nis', in: 'path' },
      }),
  })
  .openapi('StudentNisParams');

const studentNikParamsSchema = z
  .object({
    nik: z
      .string()
      .regex(/^\d{16}$/)
      .openapi({
        param: {
          name: 'nik',
          in: 'path',
          description: 'Student NIK (16 digits)',
        },
      }),
  })
  .openapi('StudentNikParams');

const studentNomorKkParamsSchema = z
  .object({
    nomorKk: z
      .string()
      .regex(/^\d{16}$/)
      .openapi({
        param: {
          name: 'nomorKk',
          in: 'path',
          description: 'Family card number (16 digits)',
        },
      }),
  })
  .openapi('StudentNomorKkParams');

const optionalNullableText = (maxLength) =>
  z.string().max(maxLength).nullable().optional();

const studentBody = z
  .object({
    nisn: z.string().min(1).max(10).openapi({ example: '0001234567' }),
    nis: z.string().min(1).max(10).openapi({ example: '1234567890' }),
    nik: z
      .string()
      .regex(/^\d{16}$/)
      .nullable()
      .optional()
      .openapi({ description: 'Sensitive: encrypted at rest; 16 digits.' }),
    nomorKk: z
      .string()
      .regex(/^\d{16}$/)
      .nullable()
      .optional()
      .openapi({
        description:
          'Sensitive: encrypted at rest; 16 digits. Multiple students may share a family card.',
      }),
    nama: z.string().min(1).max(100),
    jenisKelamin: z.enum(['LAKI_LAKI', 'PEREMPUAN']),
    tempatLahir: z.string().min(1).max(100),
    tanggalLahir: z.coerce
      .date()
      .openapi({ type: 'string', format: 'date', example: '2015-06-15' }),
    agama: z
      .enum(['ISLAM', 'KRISTEN', 'KATOLIK', 'HINDU', 'BUDDHA', 'KONGHUCU'])
      .optional(),
    alamat: z.string().min(1).max(255),
    rt: optionalNullableText(5),
    rw: optionalNullableText(5),
    kelurahan: optionalNullableText(100),
    kecamatan: optionalNullableText(100),
    kabupaten: optionalNullableText(100),
    provinsi: optionalNullableText(100),
    kodePos: optionalNullableText(5),
    telepon: optionalNullableText(20),
    email: z.string().email().max(100).nullable().optional(),
    status: z.enum(['AKTIF', 'LULUS', 'MUTASI', 'DROP_OUT']).optional(),
    orangTuaId: z.string().uuid().nullable().optional(),
    waliId: z.string().uuid().nullable().optional(),
  })
  .strict()
  .openapi('StudentWriteRequest');

const studentUpdateBodySchema = studentBody
  .partial()
  .strict()
  .refine(
    (body) => Object.keys(body).length > 0,
    'At least one student field must be provided'
  )
  .openapi('StudentUpdateRequest');

const studentListQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    search: z.string().trim().min(1).max(100).optional(),
    status: z.enum(['AKTIF', 'LULUS', 'MUTASI', 'DROP_OUT']).optional(),
    jenisKelamin: z.enum(['LAKI_LAKI', 'PEREMPUAN']).optional(),
    agama: z
      .enum(['ISLAM', 'KRISTEN', 'KATOLIK', 'HINDU', 'BUDDHA', 'KONGHUCU'])
      .optional(),
  })
  .openapi('StudentListQuery');

const studentListValidator = z.object({
  query: studentListQuerySchema,
});

const studentIdValidator = z.object({ params: studentIdParamsSchema });
const studentNisnValidator = z.object({ params: studentNisnParamsSchema });
const studentNisValidator = z.object({ params: studentNisParamsSchema });
const studentNikValidator = z.object({ params: studentNikParamsSchema });
const studentNomorKkValidator = z.object({
  params: studentNomorKkParamsSchema,
});

const createStudentValidator = z.object({
  body: studentBody,
});

const updateStudentValidator = z.object({
  params: z.object({
    id: studentIdParamsSchema.shape.id,
  }),
  body: studentUpdateBodySchema,
});

export {
  studentIdParamsSchema,
  studentNisnParamsSchema,
  studentNisParamsSchema,
  studentNikParamsSchema,
  studentNomorKkParamsSchema,
  studentBody,
  studentUpdateBodySchema,
  studentListQuerySchema,
  studentListValidator,
  studentIdValidator,
  studentNisnValidator,
  studentNisValidator,
  studentNikValidator,
  studentNomorKkValidator,
  createStudentValidator,
  updateStudentValidator,
};
