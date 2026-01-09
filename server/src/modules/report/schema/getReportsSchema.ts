import z from 'zod';

export const GetReportsSchema = z
  .object({
    tenantId: z.string().uuid(),
    status: z.enum(['DRAFT', 'VALIDATED', 'SUBMITTED']).optional(),
    shiftDate: z.string().datetime().optional().transform((val) => val ? new Date(val) : undefined),
    startDate: z.string().datetime().optional().transform((val) => val ? new Date(val) : undefined),
    endDate: z.string().datetime().optional().transform((val) => val ? new Date(val) : undefined),
    creatorId: z.string().uuid().optional(),
  })
  .refine((data) => !(data.shiftDate && (data.startDate || data.endDate)), {
    message: 'Cannot use shiftDate with startDate/endDate range',
    path: ['shiftDate'],
  });

export type GetReportsFilters = z.infer<typeof GetReportsSchema>;
