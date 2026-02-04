import { z } from 'zod';

export const getDisposalAnalyticsSchema = z.object({
  tenantId: z.string().uuid('Invalid tenant ID format'),
  startDate: z.string().datetime().transform((val) => new Date(val)).optional(),
  endDate: z.string().datetime().transform((val) => new Date(val)).optional(),
});

export type GetDisposalAnalyticsQuery = z.infer<typeof getDisposalAnalyticsSchema>;
