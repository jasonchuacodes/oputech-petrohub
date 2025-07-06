import z from 'zod';

import { Role } from '~/db/prisma';

export const createUserSchema = z.object({
    username: z.string().min(3).max(20),
    name: z.string().min(3).max(20),
    email: z.string().email(),
    role: z.nativeEnum(Role),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
