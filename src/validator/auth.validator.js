import { z } from 'zod';

const loginBodySchema = z.object({
  username: z.string().min(1).max(50),
  password: z.string().min(1),
});

const changePasswordBodySchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8),
});

const resetPasswordBodySchema = z.object({
  newPassword: z.string().min(8),
});

const resetPasswordParamsSchema = z.object({
  userId: z.string().uuid(),
});

const loginValidator = z.object({
  body: loginBodySchema,
});

const changePasswordValidator = z.object({
  body: changePasswordBodySchema,
});

const resetPasswordValidator = z.object({
  params: resetPasswordParamsSchema,
  body: resetPasswordBodySchema,
});

export {
  loginBodySchema,
  changePasswordBodySchema,
  resetPasswordBodySchema,
  resetPasswordParamsSchema,
  loginValidator,
  changePasswordValidator,
  resetPasswordValidator,
};
