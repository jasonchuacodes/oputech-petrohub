import { z } from 'zod';

export const getTenantByIdSchema = z.object({
  tenantId: z.string(),
});

export type GetTenantByIdInput = z.infer<typeof getTenantByIdSchema>;
