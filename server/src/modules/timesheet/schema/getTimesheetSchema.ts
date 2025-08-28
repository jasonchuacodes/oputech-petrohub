import z from 'zod';

export const GetTimesheetSchema = z.object({
  timesheetId: z.string().uuid(),
});

export type GetTimesheetInput = z.infer<typeof GetTimesheetSchema>;
