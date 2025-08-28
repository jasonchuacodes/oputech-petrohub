import { z } from 'zod';

export const GetTenantByIdSchema = z.object({
  tenantId: z.string(),
});

export type GetTenantByIdInput = z.infer<typeof GetTenantByIdSchema>;
