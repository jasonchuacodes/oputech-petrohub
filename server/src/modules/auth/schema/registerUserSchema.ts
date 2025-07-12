import { z } from 'zod';

import { CreateUserSchema } from '../../user/schema/createUserSchema';

export const RegisterUserSchema = CreateUserSchema.extend({
  confirmPassword: z.string().min(1),
}).refine((data) => data.password === data.confirmPassword, {
  path: ['confirmPassword'],
  message: 'Passwords do not match',
});

export type RegisterUserInput = z.infer<typeof RegisterUserSchema>;
