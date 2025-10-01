import { z } from 'zod';

export const UpdatePasswordSchema = z.object({
  id: z.string().uuid().optional(),
  oldPassword: z.string({
    message: 'Old password is required',
  }),
  newPassword: z
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
});

export type UpdatePasswordInput = z.infer<typeof UpdatePasswordSchema>;
