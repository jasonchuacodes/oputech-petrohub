import z from 'zod';

export const GetTimesheetsSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  userId: z.string().uuid().optional(),
  tenantId: z.string().uuid(),
});

export type GetTimesheetsInput = z.infer<typeof GetTimesheetsSchema>;
