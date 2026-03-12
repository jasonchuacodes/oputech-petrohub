import z from 'zod';

export const ForceUpdatePasswordSchema = z
  .object({
    newPassword: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type ForceUpdatePasswordInput = z.infer<typeof ForceUpdatePasswordSchema>;
export type ForceUpdatePasswordPayload = Omit<ForceUpdatePasswordInput, 'confirmPassword'>;
