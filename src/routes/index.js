import express from 'express';
import health from './health.route.js';

const router = express.Router();

router.use('/health', health);

export default router;
