import z from 'zod';

export const UpdatePasswordSchema = z
  .object({
    id: z.string().uuid().optional(),
    oldPassword: z.string(),
    newPassword: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type UpdatePasswordInput = z.infer<typeof UpdatePasswordSchema>;
export type UpdatePasswordPayload = Omit<UpdatePasswordInput, 'confirmPassword'>;
