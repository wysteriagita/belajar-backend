import {
  createStudent as createStudentRecord,
  findStudentById as findStudentRecordById,
  findStudentByNis as findStudentRecordByNis,
  findStudentByNisn as findStudentRecordByNisn,
  findStudentByNikHash,
  findStudents as findStudentRecords,
  findStudentsByNomorKkHash,
  softDeleteStudent as softDeleteStudentRecord,
  updateStudent as updateStudentRecord,
} from '../repositories/student.repository.js';
import appError from '../utils/appError.utils.js';
import {
  decryptStudentPii,
  encryptStudentPii,
  hashStudentPii,
} from '../utils/studentPii.utils.js';

const sensitiveFields = ['nik', 'nomorKk'];

const validateSensitiveIdentifier = (field, value) => {
  if (typeof value !== 'string' || !/^\d{16}$/.test(value)) {
    throw new appError(400, `${field} must contain exactly 16 digits`);
  }
};

const prepareStudentData = (data) => {
  const prepared = { ...data };
  delete prepared.nikHash;
  delete prepared.nomorKkHash;

  for (const field of sensitiveFields) {
    if (prepared[field] === undefined) {
      continue;
    }

    const value = prepared[field];
    if (value !== null) {
      validateSensitiveIdentifier(field, value);
    }

    prepared[`${field}Hash`] = hashStudentPii(value);
    prepared[field] = encryptStudentPii(value);
  }

  return prepared;
};

const maskSensitiveIdentifier = (value) => {
  if (value === null || value === undefined) {
    return value;
  }

  const plaintext = decryptStudentPii(value);
  return `${'*'.repeat(Math.max(plaintext.length - 4, 0))}${plaintext.slice(-4)}`;
};

const toPublicStudent = (student) => {
  if (!student) {
    return null;
  }

  return {
    ...student,
    nik: maskSensitiveIdentifier(student.nik),
    nomorKk: maskSensitiveIdentifier(student.nomorKk),
  };
};

const requireAdmin = (actor) => {
  if (actor?.role !== 'ADMIN') {
    throw new appError(
      403,
      'Only administrators can search by student NIK or KK'
    );
  }
};

const withDatabaseErrorHandling = async (operation) => {
  try {
    return await operation();
  } catch (error) {
    if (error instanceof RangeError) {
      throw new appError(400, error.message);
    }

    if (error?.code === 'P2002') {
      throw new appError(
        409,
        'A student with the provided unique data already exists'
      );
    }

    if (error?.code === 'P2025') {
      throw new appError(404, 'Student not found');
    }

    throw error;
  }
};

const findStudents = async (filters) => {
  const result = await withDatabaseErrorHandling(() =>
    findStudentRecords(filters)
  );

  return {
    ...result,
    students: result.students.map(toPublicStudent),
  };
};

const findStudentById = async (id) => {
  const student = await withDatabaseErrorHandling(() =>
    findStudentRecordById(id)
  );

  if (!student) {
    throw new appError(404, 'Student not found');
  }

  return toPublicStudent(student);
};

const findStudentByNisn = async (nisn) => {
  const student = await withDatabaseErrorHandling(() =>
    findStudentRecordByNisn(nisn)
  );

  if (!student) {
    throw new appError(404, 'Student not found');
  }

  return toPublicStudent(student);
};

const findStudentByNis = async (nis) => {
  const student = await withDatabaseErrorHandling(() =>
    findStudentRecordByNis(nis)
  );

  if (!student) {
    throw new appError(404, 'Student not found');
  }

  return toPublicStudent(student);
};

const findStudentByNik = async ({ nik, actor }) => {
  requireAdmin(actor);
  validateSensitiveIdentifier('nik', nik);
  const student = await withDatabaseErrorHandling(() =>
    findStudentByNikHash(hashStudentPii(nik))
  );

  if (!student) {
    throw new appError(404, 'Student not found');
  }

  return toPublicStudent(student);
};

const findStudentsByNomorKk = async ({ nomorKk, actor }) => {
  requireAdmin(actor);
  validateSensitiveIdentifier('nomorKk', nomorKk);
  const students = await withDatabaseErrorHandling(() =>
    findStudentsByNomorKkHash(hashStudentPii(nomorKk))
  );

  return students.map(toPublicStudent);
};

const createStudent = async (data) => {
  const student = await withDatabaseErrorHandling(() =>
    createStudentRecord(prepareStudentData(data))
  );

  return toPublicStudent(student);
};

const updateStudent = async (id, data) => {
  const student = await withDatabaseErrorHandling(() =>
    updateStudentRecord(id, prepareStudentData(data))
  );

  return toPublicStudent(student);
};

const softDeleteStudent = async (id) => {
  const student = await withDatabaseErrorHandling(() =>
    softDeleteStudentRecord(id)
  );

  return toPublicStudent(student);
};

const findStudentPiiById = async ({ id, actor }) => {
  requireAdmin(actor);

  const student = await withDatabaseErrorHandling(() =>
    findStudentRecordById(id)
  );

  if (!student) {
    throw new appError(404, 'Student not found');
  }

  return {
    ...student,
    nik: decryptStudentPii(student.nik),
    nomorKk: decryptStudentPii(student.nomorKk),
  };
};

export {
  findStudents,
  findStudentById,
  findStudentByNisn,
  findStudentByNis,
  findStudentByNik,
  findStudentsByNomorKk,
  findStudentPiiById,
  createStudent,
  updateStudent,
  softDeleteStudent,
};
