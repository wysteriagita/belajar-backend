import { z } from 'zod';

const loginValidator = z.object({
  body: z.object({
    username: z.string().min(1).max(50),
    password: z.string().min(1),
  }),
});

const changePasswordValidator = z.object({
  body: z.object({
    currentPassword: z.string().min(1),
    newPassword: z.string().min(8),
  }),
});

const resetPasswordValidator = z.object({
  params: z.object({
    userId: z.string().uuid(),
  }),
  body: z.object({
    newPassword: z.string().min(8),
  }),
});

export { loginValidator, changePasswordValidator, resetPasswordValidator };
