import z from 'zod';

export const ResetPasswordSchema = z.object({
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(20, 'Password must be at most 20 characters')
});

export type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>;
