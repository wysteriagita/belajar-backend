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

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL belum diatur');
}

const databaseUrl = new URL(process.env.DATABASE_URL);
if (!['localhost', '127.0.0.1'].includes(databaseUrl.hostname)) {
  throw new Error('Seed hanya boleh dijalankan ke database lokal');
}

faker.seed(20261016);

const fakeNik = (sequence) => String(10000 + sequence).padStart(16, '0');
const fakeNomorKk = (sequence) => String(20000 + sequence).padStart(16, '0');
const truncate = (value, maxLength) => value.slice(0, maxLength);
const randomPhone = () => `08${faker.string.numeric(10)}`;

const createHouseholds = () =>
  Array.from({ length: 3 }, (_, index) => {
    const familyNumber = index + 1;
    const fatherName = faker.person.fullName({ sex: 'male' });
    const motherName = faker.person.fullName({ sex: 'female' });
    const parentId = faker.string.uuid();
    const guardianId = faker.string.uuid();
    const address = truncate(faker.location.streetAddress(), 255);

    return {
      nomorKk: fakeNomorKk(familyNumber),
      parent: {
        id: parentId,
        namaAyah: truncate(fatherName, 100),
        nikAyah: null,
        pekerjaanAyah: truncate(faker.person.jobTitle(), 50),
        namaIbu: truncate(motherName, 100),
        nikIbu: null,
        pekerjaanIbu: truncate(faker.person.jobTitle(), 50),
        telepon: randomPhone(),
        alamat: address,
      },
      guardian: {
        id: guardianId,
        nama: truncate(faker.person.fullName(), 100),
        nik: null,
        hubungan: faker.helpers.arrayElement([
          'Kakek',
          'Nenek',
          'Paman',
          'Bibi',
        ]),
        pekerjaan: truncate(faker.person.jobTitle(), 50),
        telepon: randomPhone(),
        alamat: address,
      },
    };
  });

const runSeed = async () => {
  const seedPassword = process.env.DEV_SEED_ADMIN_PASSWORD;
  if (!seedPassword || seedPassword.length < 12) {
    throw new Error(
      'DEV_SEED_ADMIN_PASSWORD wajib diatur dengan panjang minimal 12 karakter'
    );
  }

  const demoAccounts = [
    { username: 'dev-admin', role: 'ADMIN' },
    { username: 'dev-kepala', role: 'KEPALA_SEKOLAH' },
    { username: 'dev-guru', role: 'GURU' },
    { username: 'dev-staf', role: 'STAF' },
  ];

  const password = await bcrypt.hash(seedPassword, 12);
  for (const account of demoAccounts) {
    const credentials = loginBodySchema.parse({
      username: account.username,
      password: seedPassword,
    });

    await prisma.user.upsert({
      where: { username: credentials.username },
      update: { password, role: account.role, deletedAt: null },
      create: {
        username: credentials.username,
        password,
        role: account.role,
      },
    });
  }

  const households = createHouseholds();
  for (const household of households) {
    await prisma.orangTua.upsert({
      where: { id: household.parent.id },
      update: { ...household.parent, deletedAt: null },
      create: household.parent,
    });

    await prisma.wali.upsert({
      where: { id: household.guardian.id },
      update: { ...household.guardian, deletedAt: null },
      create: household.guardian,
    });
  }

  for (let index = 1; index <= 15; index += 1) {
    const sequence = index;
    const nis = String(9000000000 + sequence).padStart(10, '0');
    const household = households[Math.floor((index - 1) / 2)];
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const emailName = `siswa-${sequence}`;

    const student = studentBody.parse({
      nisn: nis,
      nis,
      nik: fakeNik(sequence),
      nomorKk: household.nomorKk,
      nama: truncate(`${firstName} ${lastName}`, 100),
      jenisKelamin: faker.helpers.arrayElement(['LAKI_LAKI', 'PEREMPUAN']),
      tempatLahir: truncate(faker.location.city(), 100),
      tanggalLahir: faker.date.between({
        from: '2014-01-01T00:00:00.000Z',
        to: '2019-12-31T00:00:00.000Z',
      }),
      alamat: truncate(faker.location.streetAddress(), 255),
      rt: faker.string.numeric(3),
      rw: faker.string.numeric(3),
      kelurahan: truncate(faker.location.county(), 100),
      kecamatan: truncate(faker.location.county(), 100),
      kabupaten: truncate(faker.location.city(), 100),
      provinsi: truncate(faker.location.state(), 100),
      kodePos: faker.string.numeric(5),
      telepon: randomPhone(),
      email: `${emailName}@contoh.test`,
      agama: faker.helpers.arrayElement([
        'ISLAM',
        'KRISTEN',
        'KATOLIK',
        'HINDU',
        'BUDDHA',
        'KONGHUCU',
      ]),
      status: 'AKTIF',
      orangTuaId: household.parent.id,
      waliId: household.guardian.id,
    });

    const { nik, nomorKk, ...studentData } = student;
    const encryptedPii = {
      nik: encryptStudentPii(nik),
      nikHash: hashStudentPii(nik),
      nomorKk: encryptStudentPii(nomorKk),
      nomorKkHash: hashStudentPii(nomorKk),
    };

    await prisma.siswa.upsert({
      where: { nisn: student.nisn },
      update: {
        ...studentData,
        ...encryptedPii,
        deletedAt: null,
      },
      create: {
        ...studentData,
        ...encryptedPii,
      },
    });
  }

  console.log('Data dummy development berhasil dibuat.');
  console.log(
    `Akun tersedia: ${demoAccounts.map(({ username }) => username).join(', ')}`
  );
  console.log('Password semua akun menggunakan DEV_SEED_ADMIN_PASSWORD.');
  console.log('Data siswa dibuat dengan relasi orang tua dan wali fiktif.');
};

try {
  await runSeed();
} finally {
  await prisma.$disconnect();
}
