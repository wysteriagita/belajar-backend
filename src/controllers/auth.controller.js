import {
  changePassword as changePasswordService,
  forgotPassword as forgotPasswordService,
  login as loginService,
  logout as logoutService,
  resetUserPasswordByAdmin as resetUserPasswordByAdminService,
} from '../services/auth.service.js';
import { sendResponse } from '../utils/apiResponse.utils.js';
import catchAsync from '../utils/catchAsync.js';

const login = catchAsync(async (req, res) => {
  const result = await loginService(req.validated.body);
  return sendResponse(res, 200, 'Login successful', result);
});

const logout = catchAsync(async (req, res) => {
  const result = logoutService();
  return sendResponse(res, 200, result.message, null);
});

const forgotPassword = catchAsync(async (req, res) => {
  const result = forgotPasswordService();
  return sendResponse(res, 200, result.message, null);
});

const changePassword = catchAsync(async (req, res) => {
  const result = await changePasswordService({
    userId: req.user.sub,
    ...req.validated.body,
  });
  return sendResponse(res, 200, result.message, null);
});

const resetUserPasswordByAdmin = catchAsync(async (req, res) => {
  const result = await resetUserPasswordByAdminService({
    admin: req.user,
    userId: req.validated.params.userId,
    ...req.validated.body,
  });
  return sendResponse(res, 200, result.message, null);
});

export {
  login,
  logout,
  forgotPassword,
  changePassword,
  resetUserPasswordByAdmin,
};
