import { prisma } from '../config/database.js';

const studentSelect = {
  id: true,
  nisn: true,
  nis: true,
  nik: true,
  nomorKk: true,
  nama: true,
  jenisKelamin: true,
  tempatLahir: true,
  tanggalLahir: true,
  agama: true,
  alamat: true,
  rt: true,
  rw: true,
  kelurahan: true,
  kecamatan: true,
  kabupaten: true,
  provinsi: true,
  kodePos: true,
  telepon: true,
  email: true,
  status: true,
  orangTuaId: true,
  waliId: true,
  createdAt: true,
  updatedAt: true,
};

const studentFields = [
  'nisn',
  'nis',
  'nik',
  'nikHash',
  'nomorKk',
  'nomorKkHash',
  'nama',
  'jenisKelamin',
  'tempatLahir',
  'tanggalLahir',
  'agama',
  'alamat',
  'rt',
  'rw',
  'kelurahan',
  'kecamatan',
  'kabupaten',
  'provinsi',
  'kodePos',
  'telepon',
  'email',
  'status',
  'orangTuaId',
  'waliId',
];

const pickStudentFields = (data) =>
  Object.fromEntries(
    studentFields
      .filter((field) => data[field] !== undefined)
      .map((field) => [field, data[field]])
  );

const findStudents = async ({
  page = 1,
  limit = 10,
  search,
  status,
  jenisKelamin,
  agama,
} = {}) => {
  const currentPage = Number(page);
  const currentLimit = Number(limit);

  if (
    !Number.isInteger(currentPage) ||
    currentPage < 1 ||
    !Number.isInteger(currentLimit) ||
    currentLimit < 1 ||
    currentLimit > 100
  ) {
    throw new RangeError(
      'page must be positive and limit must be between 1 and 100'
    );
  }

  const where = {
    deletedAt: null,
    ...(status !== undefined && { status }),
    ...(jenisKelamin !== undefined && { jenisKelamin }),
    ...(agama !== undefined && { agama }),
    ...(search && {
      OR: [
        { nama: { contains: search, mode: 'insensitive' } },
        { nis: { contains: search, mode: 'insensitive' } },
        { nisn: { contains: search, mode: 'insensitive' } },
      ],
    }),
  };

  const [students, totalItem] = await prisma.$transaction([
    prisma.siswa.findMany({
      where,
      select: studentSelect,
      orderBy: { nama: 'asc' },
      skip: (currentPage - 1) * currentLimit,
      take: currentLimit,
    }),
    prisma.siswa.count({ where }),
  ]);

  return { students, totalItem };
};

const findStudentById = (id) =>
  prisma.siswa.findFirst({
    where: { id, deletedAt: null },
    select: studentSelect,
  });

const findStudentByNisn = (nisn) =>
  prisma.siswa.findFirst({
    where: { nisn, deletedAt: null },
    select: studentSelect,
  });

const findStudentByNis = (nis) =>
  prisma.siswa.findFirst({
    where: { nis, deletedAt: null },
    select: studentSelect,
  });

const findStudentByNikHash = (nikHash) =>
  prisma.siswa.findFirst({
    where: { nikHash, deletedAt: null },
    select: studentSelect,
  });

const findStudentsByNomorKkHash = (nomorKkHash) =>
  prisma.siswa.findMany({
    where: { nomorKkHash, deletedAt: null },
    select: studentSelect,
    orderBy: { nama: 'asc' },
  });

const createStudent = (data) =>
  prisma.siswa.create({
    data: pickStudentFields(data),
    select: studentSelect,
  });

const updateStudent = (id, data) =>
  prisma.siswa.update({
    where: { id, deletedAt: null },
    data: pickStudentFields(data),
    select: studentSelect,
  });

const softDeleteStudent = (id) =>
  prisma.siswa.update({
    where: { id, deletedAt: null },
    data: { deletedAt: new Date() },
    select: studentSelect,
  });

export {
  findStudents,
  findStudentById,
  findStudentByNisn,
  findStudentByNis,
  findStudentByNikHash,
  findStudentsByNomorKkHash,
  createStudent,
  updateStudent,
  softDeleteStudent,
};
