import z from 'zod';

export const UpdateTimesheetSchema = z.object({
  timesheetId: z.string().uuid(),
  totalHours: z.number(),
});

export type UpdateTimesheetInput = z.infer<typeof UpdateTimesheetSchema>;
