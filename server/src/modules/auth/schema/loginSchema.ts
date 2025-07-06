import { z } from 'zod';

export const userLoginSchema = z.object({
    username: z.string().min(3).max(20),
    password: z.string().min(3).max(20),
});

export type UserLoginInput = z.infer<typeof userLoginSchema>;
