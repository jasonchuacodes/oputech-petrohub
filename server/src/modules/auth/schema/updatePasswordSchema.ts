import { z } from 'zod';

export const UpdatePasswordSchema = z.object({
  id: z.string().uuid().optional(),
  oldPassword: z.string({
    message: 'Old password is required',
  }),
  newPassword: z
    .string()
    .min(6, 'Password must be at least 6 characters')
});

export type UpdatePasswordInput = z.infer<typeof UpdatePasswordSchema>;
