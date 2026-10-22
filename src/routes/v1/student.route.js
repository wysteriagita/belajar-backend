import express from 'express';
import auth from '../../middlewares/auth.middleware.js';
import validate from '../../middlewares/validate.middleware.js';
import {
  createStudentValidator,
  studentIdValidator,
  studentListValidator,
  studentSensitiveSearchValidator,
  updateStudentValidator,
} from '../../validator/student.validator.js';
import {
  createStudent,
  deleteStudent,
  getStudentById,
  getStudentPiiById,
  getStudents,
  searchStudentsBySensitiveIdentifier,
  updateStudent,
} from '../../controllers/student.controller.js';

const router = express.Router();

router.use(auth);

router.get('/', validate(studentListValidator), getStudents);
router.post('/', validate(createStudentValidator), createStudent);
router.post(
  '/search',
  validate(studentSensitiveSearchValidator),
  searchStudentsBySensitiveIdentifier
);
router.get('/:id/decry', validate(studentIdValidator), getStudentPiiById);
router.get('/:id', validate(studentIdValidator), getStudentById);
router.patch('/:id', validate(updateStudentValidator), updateStudent);
router.delete('/:id', validate(studentIdValidator), deleteStudent);

export default router;
