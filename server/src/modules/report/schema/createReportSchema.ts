import z from 'zod';

export const CreateReportSchema = z.object({
  tenantId: z.string().uuid(),
  shiftId: z.string().uuid(),
  periodStart: z.string().datetime().transform((val) => new Date(val)),
  periodEnd: z.string().datetime().transform((val) => new Date(val)),
});

export type CreateReportPayload = z.infer<typeof CreateReportSchema>;
