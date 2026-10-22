import { prisma } from '../config/database.js';

const teacherSelect = {
  id: true,
  nip: true,
  nuptk: true,
  nik: true,
  nama: true,
  jenisKelamin: true,
  tempatLahir: true,
  tanggalLahir: true,
  telepon: true,
  email: true,
  tmt: true,
  alamat: true,
  rt: true,
  rw: true,
  kelurahan: true,
  kecamatan: true,
  kabupaten: true,
  provinsi: true,
  kodePos: true,
  createdAt: true,
  updatedAt: true,
};

const teacherFields = [
  'nip',
  'nuptk',
  'nik',
  'nikHash',
  'nama',
  'jenisKelamin',
  'tempatLahir',
  'tanggalLahir',
  'telepon',
  'email',
  'tmt',
  'alamat',
  'rt',
  'rw',
  'kelurahan',
  'kecamatan',
  'kabupaten',
  'provinsi',
  'kodePos',
];

const pickTeacherFields = (data) =>
  Object.fromEntries(
    teacherFields
      .filter((field) => data[field] !== undefined)
      .map((field) => [field, data[field]])
  );

const findTeachers = async ({
  page = 1,
  limit = 10,
  search,
  nama,
  nip,
  nuptk,
  email,
  jenisKelamin,
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
    ...(nama && { nama: { contains: nama, mode: 'insensitive' } }),
    ...(nip !== undefined && { nip }),
    ...(nuptk !== undefined && { nuptk }),
    ...(email !== undefined && { email }),
    ...(jenisKelamin !== undefined && { jenisKelamin }),
    ...(search && {
      OR: [
        { nama: { contains: search, mode: 'insensitive' } },
        { nip: { contains: search, mode: 'insensitive' } },
        { nuptk: { contains: search, mode: 'insensitive' } },
      ],
    }),
  };

  const [teachers, totalItem] = await prisma.$transaction([
    prisma.guru.findMany({
      where,
      select: teacherSelect,
      orderBy: { nama: 'asc' },
      skip: (currentPage - 1) * currentLimit,
      take: currentLimit,
    }),
    prisma.guru.count({ where }),
  ]);

  return { teachers, totalItem };
};

const findTeacherById = (id) =>
  prisma.guru.findFirst({
    where: { id, deletedAt: null },
    select: teacherSelect,
  });

const createTeacher = (data) =>
  prisma.guru.create({
    data: pickTeacherFields(data),
    select: teacherSelect,
  });

const updateTeacher = (id, data) =>
  prisma.guru.update({
    where: { id, deletedAt: null },
    data: pickTeacherFields(data),
    select: teacherSelect,
  });

const softDeleteTeacher = (id) =>
  prisma.guru.update({
    where: { id, deletedAt: null },
    data: { deletedAt: new Date() },
    select: teacherSelect,
  });

export {
  findTeachers,
  findTeacherById,
  createTeacher,
  updateTeacher,
  softDeleteTeacher,
};
