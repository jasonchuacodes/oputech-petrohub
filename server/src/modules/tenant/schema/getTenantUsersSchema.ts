import { z } from 'zod';
import { Role } from '~/db/prisma';

export const GetTenantUsersSchema = z.object({
  tenantId: z.string(),
  searchTerm: z.string().min(1).optional(),
  role: z.nativeEnum(Role).optional(),
});

export type GetTenantUsersInput = z.infer<typeof GetTenantUsersSchema>;
