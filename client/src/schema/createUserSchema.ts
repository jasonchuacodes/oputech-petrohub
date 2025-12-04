import z from 'zod';

import { UserRoleEnum } from '~/services/user/user.types';

export const CreateUserSchema = z.object({
  name: z.string().min(1),
  username: z.string().min(1, 'Username is required').max(20).trim(),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(20, 'Password must be at most 20 characters'),
  role: z.nativeEnum(UserRoleEnum),
});

export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type CreateUserPayload = CreateUserInput & {
  tenantId: string;
};
