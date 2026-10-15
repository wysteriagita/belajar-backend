import 'dotenv/config';
import bcrypt from 'bcrypt';
import { fakerID_ID as faker } from '@faker-js/faker';
import { loginBodySchema } from '../src/validator/auth.validator.js';
import { studentBody } from '../src/validator/student.validator.js';
import {
  encryptStudentPii,
  hashStudentPii,
} from '../src/utils/studentPii.utils.js';
import { prisma } from '../src/config/database.js';

if (process.env.NODE_ENV !== 'development') {
  throw new Error('Seed hanya boleh dijalankan di mode development');
}

const databaseUrl = new URL(process.env.DATABASE_URL);
if (!['localhost', '127.0.0.1'].includes(databaseUrl.hostname)) {
  throw new Error('Seed hanya boleh dijalankan ke database lokal');
}

faker.seed(20261016);

const runSeed = async () => {
  const credentials = loginBodySchema.parse({
    username: 'dev-admin',
    password: process.env.DEV_SEED_ADMIN_PASSWORD,
  });

  const password = await bcrypt.hash(credentials.password, 12);

  await prisma.user.upsert({
    where: { username: credentials.username },
    update: { password, role: 'ADMIN' },
    create: {
      username: credentials.username,
      password,
      role: 'ADMIN',
    },
  });

  const nomorKkFiktif = '0000000000000001';

  for (let index = 1; index <= 5; index += 1) {
    const nis = String(index).padStart(10, '0');

    const student = studentBody.parse({
      nisn: nis,
      nis,
      // Nilai fiktif berformat 16 digit untuk menguji enkripsi.
      nik: `000000000000${String(index).padStart(4, '0')}`,
      nomorKk: nomorKkFiktif,
      nama: faker.person.fullName(),
      jenisKelamin: faker.helpers.arrayElement(['LAKI_LAKI', 'PEREMPUAN']),
      tempatLahir: faker.location.city(),
      tanggalLahir: faker.date.birthdate({
        min: 7,
        max: 12,
        mode: 'age',
      }),
      alamat: faker.location.streetAddress(),
      email: `siswa${index}@contoh.test`,
      agama: faker.helpers.arrayElement([
        'ISLAM',
        'KRISTEN',
        'KATOLIK',
        'HINDU',
        'BUDDHA',
        'KONGHUCU',
      ]),
    });

    const { nik, nomorKk, ...studentData } = student;

    await prisma.siswa.upsert({
      where: { nisn: student.nisn },
      update: {
        ...studentData,
        nik: encryptStudentPii(nik),
        nikHash: hashStudentPii(nik),
        nomorKk: encryptStudentPii(nomorKk),
        nomorKkHash: hashStudentPii(nomorKk),
      },
      create: {
        ...studentData,
        nik: encryptStudentPii(nik),
        nikHash: hashStudentPii(nik),
        nomorKk: encryptStudentPii(nomorKk),
        nomorKkHash: hashStudentPii(nomorKk),
      },
    });
  }

  console.log('Data dummy development berhasil dibuat.');
};

try {
  await runSeed();
} finally {
  await prisma.$disconnect();
}
