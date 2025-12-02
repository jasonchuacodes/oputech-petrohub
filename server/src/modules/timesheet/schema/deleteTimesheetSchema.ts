import z from 'zod';

export const DeleteTimesheetSchema = z.object({
  timesheetId: z.string().uuid(),
});

export type DeleteTimesheetInput = z.infer<typeof DeleteTimesheetSchema>;
