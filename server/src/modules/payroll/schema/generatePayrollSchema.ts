import { z } from 'zod';
import { PayrollPeriodType } from '@prisma';

export const GeneratePayrollSchema = z.object({
  userId: z.string().uuid(),
  tenantId: z.string().uuid(),
  timesheetIds: z.array(z.string().uuid()).min(1),
  periodType: z.nativeEnum(PayrollPeriodType),
  periodStart: z.string().datetime(),
  periodEnd: z.string().datetime(),
});

export type GeneratePayrollInput = z.infer<typeof GeneratePayrollSchema>;
