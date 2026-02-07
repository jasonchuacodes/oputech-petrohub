import { z } from 'zod';

export const GetPayrollRecordsSchema = z.object({
  tenantId: z.string().uuid(),
  userId: z.string().uuid().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

export type GetPayrollRecordsInput = z.infer<typeof GetPayrollRecordsSchema>;
