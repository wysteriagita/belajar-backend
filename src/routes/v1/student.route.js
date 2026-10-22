import express from 'express';
import auth from '../../middlewares/authenticate.middleware.js';
import authorize from '../../middlewares/authorize.middleware.js';
import validate from '../../middlewares/validate.middleware.js';
import { PERMISSIONS } from '../../policies/authorization.policy.js';
import {
  createStudentValidator,
  createStudentsValidator,
  studentIdValidator,
  studentListValidator,
  studentSensitiveSearchValidator,
  updateStudentValidator,
} from '../../validator/student.validator.js';
import {
  createStudent,
  createStudents,
  deleteStudent,
  getStudentById,
  getStudentPiiById,
  getStudents,
  searchStudentsBySensitiveIdentifier,
  updateStudent,
} from '../../controllers/student.controller.js';

const router = express.Router();

router.use(auth);

router.get(
  '/',
  authorize(PERMISSIONS.STUDENTS_READ),
  validate(studentListValidator),
  getStudents
);
router.post(
  '/',
  authorize(PERMISSIONS.STUDENTS_CREATE),
  validate(createStudentValidator),
  createStudent
);
router.post(
  '/bulk',
  authorize(PERMISSIONS.STUDENTS_CREATE),
  validate(createStudentsValidator),
  createStudents
);
router.post(
  '/search',
  authorize(PERMISSIONS.STUDENTS_ACCESS_SENSITIVE_DATA),
  validate(studentSensitiveSearchValidator),
  searchStudentsBySensitiveIdentifier
);
router.get(
  '/:id/decry',
  authorize(PERMISSIONS.STUDENTS_ACCESS_SENSITIVE_DATA),
  validate(studentIdValidator),
  getStudentPiiById
);
router.get(
  '/:id',
  authorize(PERMISSIONS.STUDENTS_READ),
  validate(studentIdValidator),
  getStudentById
);
router.patch(
  '/:id',
  authorize(PERMISSIONS.STUDENTS_UPDATE),
  validate(updateStudentValidator),
  updateStudent
);
router.delete(
  '/:id',
  authorize(PERMISSIONS.STUDENTS_DELETE),
  validate(studentIdValidator),
  deleteStudent
);

export default router;
