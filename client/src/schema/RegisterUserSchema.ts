import z from 'zod';

export const RegisterUserSchema = z
  .object({
    username: z.string().min(1, 'Username is required').max(20).trim(),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(20, 'Password must be at most 20 characters')
      .refine((val) => /[A-Z]/.test(val), {
        message: 'Password must include at least one uppercase letter',
      })
      .refine((val) => /[a-z]/.test(val), {
        message: 'Password must include at least one lowercase letter',
      })
      .refine((val) => /[0-9]/.test(val), {
        message: 'Password must include at least one number',
      })
      .refine((val) => /[!@#$%^&*()_\-+=[\]{};':"\\|,.<>/?]/.test(val), {
        message: 'Password must include at least one special character',
      }),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type RegisterUserInput = z.infer<typeof RegisterUserSchema>;
