import { z } from 'zod';
import { Role } from '@prisma';

export const CreateUserSchema = z
  .object({
    name: z.string().min(1),
    username: z.string().min(1).max(20),
    email: z.string().email().optional(),
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
    role: z.nativeEnum(Role).default(Role.USER),
  })

export type CreateUserInput = z.infer<typeof CreateUserSchema>;
