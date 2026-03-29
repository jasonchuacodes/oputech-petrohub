import z from 'zod';

import { ReportStatus } from '~/db/prisma';
import { getStartOfDay } from '~/utils';

export const GetReportsSchema = z
  .object({
    tenantId: z.string().uuid(),
    status: z.enum([ReportStatus.DRAFT, ReportStatus.VALIDATED, ReportStatus.SUBMITTED]).optional(),
    shiftDate: z
      .string()
      .datetime()
      .optional()
      .transform((val) => (val ? getStartOfDay(new Date(val)) : undefined)),
    startDate: z
      .string()
      .datetime()
      .optional()
      .transform((val) => (val ? getStartOfDay(new Date(val)) : undefined)),
    endDate: z
      .string()
      .datetime()
      .optional()
      .transform((val) => (val ? getStartOfDay(new Date(val)) : undefined)),
    creatorId: z.string().uuid().optional(),
    page: z.coerce.number().int().positive().default(1),
    pageSize: z.coerce.number().int().positive().max(100).default(100),
  })
  .refine((data) => !(data.shiftDate && (data.startDate || data.endDate)), {
    message: 'Cannot use shiftDate with startDate/endDate range',
    path: ['shiftDate'],
  });

export type GetReportsFilters = z.infer<typeof GetReportsSchema>;
