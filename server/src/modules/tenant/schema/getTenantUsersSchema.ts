import { z } from 'zod';

export const GetTenantUsersSchema = z.object({
  tenantId: z.string(),
});

export type GetTenantUsersInput = z.infer<typeof GetTenantUsersSchema>;
