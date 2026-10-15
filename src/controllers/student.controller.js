import {
  createStudent as createStudentService,
  findStudentById as findStudentByIdService,
  findStudentByNik as findStudentByNikService,
  findStudentByNis as findStudentByNisService,
  findStudentByNisn as findStudentByNisnService,
  findStudentPiiById as findStudentPiiByIdService,
  findStudents as findStudentsService,
  findStudentsByNomorKk as findStudentsByNomorKkService,
  softDeleteStudent as softDeleteStudentService,
  updateStudent as updateStudentService,
} from '../services/student.service.js';
import {
  sendPaginatedResponse,
  sendResponse,
} from '../utils/apiResponse.utils.js';
import catchAsync from '../utils/catchAsync.js';

const getStudents = catchAsync(async (req, res) => {
  const filters = req.validated.query ?? {};
  const { students, totalItem } = await findStudentsService(filters);
  const page = filters.page ?? 1;
  const limit = filters.limit ?? 10;

  return sendPaginatedResponse(
    res,
    200,
    'Students retrieved successfully',
    students,
    { page, limit, totalItem }
  );
});

const getStudentById = catchAsync(async (req, res) => {
  const student = await findStudentByIdService(req.validated.params.id);
  return sendResponse(res, 200, 'Student retrieved successfully', student);
});

const getStudentByNisn = catchAsync(async (req, res) => {
  const student = await findStudentByNisnService(req.validated.params.nisn);
  return sendResponse(res, 200, 'Student retrieved successfully', student);
});

const getStudentByNis = catchAsync(async (req, res) => {
  const student = await findStudentByNisService(req.validated.params.nis);
  return sendResponse(res, 200, 'Student retrieved successfully', student);
});

const getStudentByNik = catchAsync(async (req, res) => {
  const student = await findStudentByNikService({
    nik: req.validated.params.nik,
    actor: req.user,
  });
  return sendResponse(res, 200, 'Student retrieved successfully', student);
});

const getStudentsByNomorKk = catchAsync(async (req, res) => {
  const students = await findStudentsByNomorKkService({
    nomorKk: req.validated.params.nomorKk,
    actor: req.user,
  });
  return sendResponse(res, 200, 'Students retrieved successfully', students);
});

const getStudentPiiById = catchAsync(async (req, res) => {
  const student = await findStudentPiiByIdService({
    id: req.validated.params.id,
    actor: req.user,
  });
  return sendResponse(
    res,
    200,
    'Student sensitive data retrieved successfully',
    student
  );
});

const createStudent = catchAsync(async (req, res) => {
  const student = await createStudentService(req.validated.body);
  return sendResponse(res, 201, 'Student created successfully', student);
});

const updateStudent = catchAsync(async (req, res) => {
  const student = await updateStudentService(
    req.validated.params.id,
    req.validated.body
  );
  return sendResponse(res, 200, 'Student updated successfully', student);
});

const deleteStudent = catchAsync(async (req, res) => {
  const student = await softDeleteStudentService(req.validated.params.id);
  return sendResponse(res, 200, 'Student deleted successfully', student);
});

export {
  getStudents,
  getStudentById,
  getStudentByNisn,
  getStudentByNis,
  getStudentByNik,
  getStudentsByNomorKk,
  getStudentPiiById,
  createStudent,
  updateStudent,
  deleteStudent,
};
