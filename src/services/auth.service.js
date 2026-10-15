import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {
  findUserById,
  findUserByIdWithPassword,
  findUserByUsername,
  updateUser,
} from '../repositories/user.repository.js';
import appError from '../utils/appError.utils.js';

const SALT_ROUNDS = 12;

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new appError(500, 'JWT_SECRET is not configured');
  }

  return secret;
};

const login = async ({ username, password }) => {
  const user = await findUserByUsername(username);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new appError(401, 'Username or password is incorrect');
  }

  const publicUser = { ...user };
  delete publicUser.password;
  const token = jwt.sign(
    { username: publicUser.username, role: publicUser.role },
    getJwtSecret(),
    {
      algorithm: 'HS256',
      subject: publicUser.id,
      expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    }
  );

  return { token, tokenType: 'Bearer', user: publicUser };
};

const logout = () => ({
  message: 'Logout successful. Remove the bearer token from the client.',
});

const forgotPassword = () => ({
  message: 'Please contact your administrator to reset your password.',
});

const changePassword = async ({ userId, currentPassword, newPassword }) => {
  const user = await findUserByIdWithPassword(userId);

  if (!user || !(await bcrypt.compare(currentPassword, user.password))) {
    throw new appError(401, 'Current password is incorrect');
  }

  const password = await bcrypt.hash(newPassword, SALT_ROUNDS);
  await updateUser(user.id, { password });

  return { message: 'Password changed successfully' };
};

const resetUserPasswordByAdmin = async ({ admin, userId, newPassword }) => {
  if (admin?.role !== 'ADMIN') {
    throw new appError(403, 'Only administrators can reset user passwords');
  }

  const user = await findUserById(userId);
  if (!user) {
    throw new appError(404, 'User not found');
  }

  const password = await bcrypt.hash(newPassword, SALT_ROUNDS);
  await updateUser(userId, { password });

  return { message: 'User password reset successfully' };
};

export {
  login,
  logout,
  forgotPassword,
  changePassword,
  resetUserPasswordByAdmin,
};
