import z from 'zod';
import { getStartOfDay } from '~/utils';

export const GetReportByShiftSchema = z.object({
  tenantId: z.string().uuid(),
  shiftId: z.string().uuid(),
  shiftDate: z
    .string()
    .datetime()
    .transform((val) => getStartOfDay(new Date(val))),
});

export type GetReportByShiftPayload = z.infer<typeof GetReportByShiftSchema>;
