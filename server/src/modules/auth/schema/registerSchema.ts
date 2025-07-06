import { z } from 'zod';
import { Role } from '@prisma';

export const userRegisterSchema = z.object({
    name: z.string().min(3),
    username: z.string().min(3).max(20),
    email: z.string().email(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
    role: z.nativeEnum(Role),
});

export type UserRegisterInput = z.infer<typeof userRegisterSchema>;
