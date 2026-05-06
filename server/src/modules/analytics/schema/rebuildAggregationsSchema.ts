import { z } from 'zod';

export const rebuildAggregationsSchema = z.object({
  tenantId: z.string().uuid('Invalid tenant ID format'),
});
