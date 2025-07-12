import { z } from 'zod';

export const LoginUserSchema = z.object({
    username: z.string(),
    password: z.string(),
});

export type LoginUserInput = z.infer<typeof LoginUserSchema>;
