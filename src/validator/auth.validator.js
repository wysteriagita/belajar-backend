import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

const loginBodySchema = z
  .object({
    username: z.string().min(1).max(50).openapi({ example: 'guru01' }),
    password: z
      .string()
      .min(1)
      .openapi({ format: 'password', example: 'password123' }),
  })
  .openapi('LoginRequest');

const changePasswordBodySchema = z
  .object({
    currentPassword: z.string().min(1).openapi({ format: 'password' }),
    newPassword: z.string().min(8).openapi({ format: 'password' }),
  })
  .openapi('ChangePasswordRequest');

const resetPasswordBodySchema = z
  .object({
    newPassword: z.string().min(8).openapi({ format: 'password' }),
  })
  .openapi('ResetPasswordRequest');

const resetPasswordParamsSchema = z
  .object({
    userId: z
      .string()
      .uuid()
      .openapi({
        param: {
          name: 'userId',
          in: 'path',
        },
      }),
  })
  .openapi('ResetPasswordParams');

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
