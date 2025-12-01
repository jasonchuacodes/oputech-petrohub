import { z } from 'zod';
import { Role } from '@prisma';

export const CreateUserSchema = z.object({
  name: z.string().min(1),
  username: z.string().min(1).max(20),
  email: z.string().email().optional(),
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
  role: z.nativeEnum(Role).default(Role.USER),
  tenantId: z.string().optional(),
});

export type CreateUserInput = z.infer<typeof CreateUserSchema>;
