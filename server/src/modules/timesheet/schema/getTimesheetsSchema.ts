import z from 'zod';

export const GetTimesheetsSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  username: z.string().optional()
});

export type GetTimesheetsInput = z.infer<typeof GetTimesheetsSchema>;
