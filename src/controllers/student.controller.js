import {
  createStudent as createStudentService,
  createStudents as createStudentsService,
  findStudentById as findStudentByIdService,
  getStudentWithDecryptedSensitiveDataById as getStudentWithDecryptedSensitiveDataByIdService,
  findStudents as findStudentsService,
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

const searchStudentsBySensitiveIdentifier = catchAsync(async (req, res) => {
  const filters = req.validated.body;
  const { students, totalItem } = await findStudentsService({
    ...filters,
    actor: req.user,
  });

  return sendPaginatedResponse(
    res,
    200,
    'Students retrieved successfully',
    students,
    {
      page: filters.page,
      limit: filters.limit,
      totalItem,
    }
  );
});

const getStudentById = catchAsync(async (req, res) => {
  const student = await findStudentByIdService(req.validated.params.id);
  return sendResponse(res, 200, 'Student retrieved successfully', student);
});

const getStudentPiiById = catchAsync(async (req, res) => {
  const student = await getStudentWithDecryptedSensitiveDataByIdService({
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

const createStudents = catchAsync(async (req, res) => {
  const students = await createStudentsService(req.validated.body);
  return sendResponse(res, 201, 'Students created successfully', students);
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
  searchStudentsBySensitiveIdentifier,
  getStudentById,
  getStudentPiiById,
  createStudent,
  createStudents,
  updateStudent,
  deleteStudent,
};
