import { z } from 'zod';

const uuidParams = (key = 'id') =>
  z.object({
    params: z.object({
      [key]: z.string().uuid(),
    }),
  });

const identifierParams = (key, length) =>
  z.object({
    params: z.object({
      [key]: z.string().regex(new RegExp(`^\\d{${length}}$`)),
    }),
  });

const optionalNullableText = (maxLength) =>
  z.string().max(maxLength).nullable().optional();

const studentBody = z
  .object({
    nisn: z.string().min(1).max(10),
    nis: z.string().min(1).max(10),
    nik: z
      .string()
      .regex(/^\d{16}$/)
      .nullable()
      .optional(),
    nomorKk: z
      .string()
      .regex(/^\d{16}$/)
      .nullable()
      .optional(),
    nama: z.string().min(1).max(100),
    jenisKelamin: z.enum(['LAKI_LAKI', 'PEREMPUAN']),
    tempatLahir: z.string().min(1).max(100),
    tanggalLahir: z.coerce.date(),
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
  .strict();

const studentListValidator = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    search: z.string().trim().min(1).max(100).optional(),
    status: z.enum(['AKTIF', 'LULUS', 'MUTASI', 'DROP_OUT']).optional(),
    jenisKelamin: z.enum(['LAKI_LAKI', 'PEREMPUAN']).optional(),
    agama: z
      .enum(['ISLAM', 'KRISTEN', 'KATOLIK', 'HINDU', 'BUDDHA', 'KONGHUCU'])
      .optional(),
  }),
});

const studentIdValidator = uuidParams();
const studentNisnValidator = identifierParams('nisn', 10);
const studentNisValidator = identifierParams('nis', 10);
const studentNikValidator = identifierParams('nik', 16);
const studentNomorKkValidator = identifierParams('nomorKk', 16);

const createStudentValidator = z.object({
  body: studentBody,
});

const updateStudentValidator = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: studentBody
    .partial()
    .strict()
    .refine(
      (body) => Object.keys(body).length > 0,
      'At least one student field must be provided'
    ),
});

export {
  studentListValidator,
  studentIdValidator,
  studentNisnValidator,
  studentNisValidator,
  studentNikValidator,
  studentNomorKkValidator,
  createStudentValidator,
  updateStudentValidator,
};
