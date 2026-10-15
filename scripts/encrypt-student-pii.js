import 'dotenv/config';
import { prisma } from '../src/config/database.js';
import {
  encryptStudentPii,
  hashStudentPii,
} from '../src/utils/studentPii.utils.js';

const BATCH_SIZE = 100;

const encryptExistingStudentPii = async () => {
  let processed = 0;

  while (true) {
    const students = await prisma.siswa.findMany({
      where: {
        OR: [
          { nik: { not: null }, nikHash: null },
          { nomorKk: { not: null }, nomorKkHash: null },
        ],
      },
      select: {
        id: true,
        nik: true,
        nikHash: true,
        nomorKk: true,
        nomorKkHash: true,
      },
      orderBy: { id: 'asc' },
      take: BATCH_SIZE,
    });

    if (students.length === 0) {
      break;
    }

    for (const student of students) {
      const data = {};

      if (student.nik !== null && student.nikHash === null) {
        data.nik = encryptStudentPii(student.nik);
        data.nikHash = hashStudentPii(student.nik);
      }

      if (student.nomorKk !== null && student.nomorKkHash === null) {
        data.nomorKk = encryptStudentPii(student.nomorKk);
        data.nomorKkHash = hashStudentPii(student.nomorKk);
      }

      await prisma.siswa.update({
        where: { id: student.id },
        data,
      });
      processed += 1;
    }
  }

  console.log(`Encrypted sensitive data for ${processed} student record(s).`);
};

try {
  await encryptExistingStudentPii();
} catch (error) {
  console.error('Student PII encryption migration failed:', error.message);
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
