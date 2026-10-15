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

/**
 * @openapi
 * /v1/auth/login:
 *   post:
 *     summary: Log in with username and password
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, password]
 *             properties:
 *               username:
 *                 type: string
 *                 maxLength: 50
 *                 example: guru01
 *               password:
 *                 type: string
 *                 format: password
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful; returns a JWT and public user details.
 *       400:
 *         description: Invalid request body.
 *       401:
 *         description: Username or password is incorrect.
 */
router.post('/login', validate(loginValidator), login);

/**
 * @openapi
 * /v1/auth/logout:
 *   post:
 *     summary: Log out
 *     description: Client must discard its bearer token. The stateless JWT remains valid until it expires.
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout response.
 *       401:
 *         description: Missing or invalid bearer token.
 */
router.post('/logout', auth, logout);

/**
 * @openapi
 * /v1/auth/forgot-password:
 *   post:
 *     summary: Get instructions for resetting a password
 *     description: Password reset is handled by an administrator; this endpoint does not send email.
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Instructions to contact an administrator.
 */
router.post('/forgot-password', forgotPassword);

/**
 * @openapi
 * /v1/auth/password:
 *   patch:
 *     summary: Change the current user's password
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [currentPassword, newPassword]
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 format: password
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *     responses:
 *       200:
 *         description: Password changed successfully.
 *       400:
 *         description: Invalid request body.
 *       401:
 *         description: Missing/invalid token or incorrect current password.
 */
router.patch(
  '/password',
  auth,
  validate(changePasswordValidator),
  changePassword
);

/**
 * @openapi
 * /v1/auth/users/{userId}/password:
 *   patch:
 *     summary: Reset a user's password as an administrator
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [newPassword]
 *             properties:
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *     responses:
 *       200:
 *         description: User password reset successfully.
 *       400:
 *         description: Invalid user ID or request body.
 *       401:
 *         description: Missing or invalid bearer token.
 *       403:
 *         description: Only administrators can reset user passwords.
 *       404:
 *         description: User not found.
 */
router.patch(
  '/users/:userId/password',
  auth,
  validate(resetPasswordValidator),
  resetUserPasswordByAdmin
);

export default router;
