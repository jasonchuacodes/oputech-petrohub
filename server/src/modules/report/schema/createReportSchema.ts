import z from 'zod';

import { getStartOfDay } from '~/utils';

export const CreateReportSchema = z.object({
  tenantId: z.string().uuid(),
  shiftId: z.string().uuid(),
  shiftDate: z.string().datetime().transform((val) => getStartOfDay(new Date(val))),   
});

export type CreateReportPayload = z.infer<typeof CreateReportSchema>;
