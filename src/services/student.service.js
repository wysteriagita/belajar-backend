import {
  createStudent as createStudentRecord,
  createStudents as createStudentRecords,
  findStudentById as findStudentRecordById,
  findStudents as findStudentRecords,
  softDeleteStudent as softDeleteStudentRecord,
  updateStudent as updateStudentRecord,
} from '../repositories/student.repository.js';
import appError from '../utils/appError.utils.js';
import {
  decryptSensitiveData,
  encryptSensitiveData,
  hashSensitiveData,
} from '../utils/encryptDecriptData.utils.js';

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

    prepared[`${field}Hash`] = hashSensitiveData(value);
    prepared[field] = encryptSensitiveData(value);
  }

  return prepared;
};

const maskSensitiveIdentifier = (value) => {
  if (value === null || value === undefined) {
    return value;
  }

  const plaintext = decryptSensitiveData(value);
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
  const { actor, nik, nomorKk, ...studentFilters } = filters;
  if (nik !== undefined || nomorKk !== undefined) {
    requireAdmin(actor);
  }

  const result = await withDatabaseErrorHandling(() =>
    findStudentRecords({
      ...studentFilters,
      ...(nik !== undefined && { nikHash: hashSensitiveData(nik) }),
      ...(nomorKk !== undefined && {
        nomorKkHash: hashSensitiveData(nomorKk),
      }),
    })
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

const createStudent = async (data) => {
  const student = await withDatabaseErrorHandling(() =>
    createStudentRecord(prepareStudentData(data))
  );

  return toPublicStudent(student);
};

const createStudents = async (students) => {
  const createdStudents = await withDatabaseErrorHandling(() =>
    createStudentRecords(students.map(prepareStudentData))
  );

  return createdStudents.map(toPublicStudent);
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
    nik: decryptSensitiveData(student.nik),
    nomorKk: decryptSensitiveData(student.nomorKk),
  };
};

export {
  findStudents,
  findStudentById,
  findStudentPiiById,
  createStudent,
  createStudents,
  updateStudent,
  softDeleteStudent,
};
