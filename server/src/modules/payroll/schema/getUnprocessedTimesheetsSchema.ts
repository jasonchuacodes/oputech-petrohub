import { z } from 'zod';

export const GetUnprocessedTimesheetsSchema = z.object({
  userId: z.string().uuid(),
  tenantId: z.string().uuid(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
});

export type GetUnprocessedTimesheetsInput = z.infer<typeof GetUnprocessedTimesheetsSchema>;
