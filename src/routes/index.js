import express from 'express';
import health from './health.route.js';
import auth from './v1/auth.route.js';
import students from './v1/student.route.js';

const router = express.Router();

router.use('/health', health);
router.use('/v1/auth', auth);
router.use('/v1/students', students);

export default router;
