import express from 'express';
import health from './health.route.js';
import auth from './v1/auth.route.js';

const router = express.Router();

router.use('/health', health);
router.use('/v1/auth', auth);

export default router;
