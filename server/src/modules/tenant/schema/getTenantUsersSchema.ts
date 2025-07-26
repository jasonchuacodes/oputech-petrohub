import { z } from 'zod';

export const GetTenantUsersSchema = z.object({
  tenantId: z.coerce.number().int().positive(),
});

export type GetTenantUsersInput = z.infer<typeof GetTenantUsersSchema>;
