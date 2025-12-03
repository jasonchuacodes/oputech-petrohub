import z from 'zod';

export const ResetPasswordSchema = z.object({
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(20, 'Password must be at most 20 characters')
    .refine((val) => /[A-Z]/.test(val), {
      message: 'Password must include at least one uppercase letter',
    })
    .refine((val) => /[a-z]/.test(val), {
      message: 'Password must include at least one lowercase letter',
    })
    .refine((val) => /[0-9]/.test(val), {
      message: 'Password must include at least one number',
    }),
});

export type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>;
