import express from 'express';
import auth from '../../middlewares/auth.middleware.js';
import validate from '../../middlewares/validate.middleware.js';
import {
  createStudentValidator,
  studentIdValidator,
  studentListValidator,
  studentNikValidator,
  studentNisnValidator,
  studentNisValidator,
  studentNomorKkValidator,
  updateStudentValidator,
} from '../../validator/student.validator.js';
import {
  createStudent,
  deleteStudent,
  getStudentById,
  getStudentByNik,
  getStudentByNis,
  getStudentByNisn,
  getStudentPiiById,
  getStudents,
  getStudentsByNomorKk,
  updateStudent,
} from '../../controllers/student.controller.js';

const router = express.Router();

router.use(auth);

router.get('/', validate(studentListValidator), getStudents);
router.post('/', validate(createStudentValidator), createStudent);
router.get('/by-nisn/:nisn', validate(studentNisnValidator), getStudentByNisn);
router.get('/by-nis/:nis', validate(studentNisValidator), getStudentByNis);
router.get('/by-nik/:nik', validate(studentNikValidator), getStudentByNik);
router.get(
  '/by-nomor-kk/:nomorKk',
  validate(studentNomorKkValidator),
  getStudentsByNomorKk
);
router.get('/:id/pii', validate(studentIdValidator), getStudentPiiById);
router.get('/:id', validate(studentIdValidator), getStudentById);
router.patch('/:id', validate(updateStudentValidator), updateStudent);
router.delete('/:id', validate(studentIdValidator), deleteStudent);

export default router;
