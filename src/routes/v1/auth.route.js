import express from 'express';
import auth from '../../middlewares/auth.middleware.js';
import validate from '../../middlewares/validate.middleware.js';
import {
  changePasswordValidator,
  loginValidator,
  resetPasswordValidator,
} from '../../validator/auth.validator.js';
import {
  changePassword,
  forgotPassword,
  login,
  logout,
  resetUserPasswordByAdmin,
} from '../../controllers/auth.controller.js';

const router = express.Router();

router.post('/login', validate(loginValidator), login);
router.post('/logout', auth, logout);
router.post('/forgot-password', forgotPassword);
router.patch(
  '/password',
  auth,
  validate(changePasswordValidator),
  changePassword
);
router.patch(
  '/users/:userId/password',
  auth,
  validate(resetPasswordValidator),
  resetUserPasswordByAdmin
);

export default router;
