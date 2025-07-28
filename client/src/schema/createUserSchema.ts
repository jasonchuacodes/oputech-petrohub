import z from 'zod';

import { UserRoleEnum } from '~/services/user/user.types';

export const CreateUserSchema = z.object({
  name: z.string().min(1),
  username: z.string().min(1, 'Username is required').max(20).trim(),
  role: z.nativeEnum(UserRoleEnum),
});

export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type CreateUserPayload = CreateUserInput & {
  tenantId: number;
};
