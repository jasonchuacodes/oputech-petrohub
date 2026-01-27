import { z } from 'zod';

export const GetTenantUsersSchema = z.object({
  tenantId: z.string(),
  searchTerm: z.string().min(1).optional(),
});

export type GetTenantUsersInput = z.infer<typeof GetTenantUsersSchema>;
