import express from 'express';
import { sendResponse } from '../utils/apiResponse.utils.js';

const router = express.Router();

router.get('/', (req, res) => {
  return sendResponse(res, 200, 'server is running');
});

export default router;
