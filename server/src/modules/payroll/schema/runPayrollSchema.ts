import { z } from 'zod';

export const RunPayrollSchema = z.object({
  tenantId: z.string().uuid(),
  periodType: z.enum(['WEEKLY']),
  periodStart: z.string().datetime(),
  periodEnd: z.string().datetime(),
  payslips: z.array(
    z.object({
      userId: z.string().uuid(),
      timesheetIds: z.array(z.string().uuid()),
      totalHours: z.number().min(0),
      rateSnapshot: z.string(),
      rateTypeSnapshot: z.enum(['HOURLY', 'DAILY']),
      totalCompensation: z.string(),
      notes: z.string().optional(),
    })
  ),
  notes: z.string().optional(),
});

export type RunPayrollInput = z.infer<typeof RunPayrollSchema>;
