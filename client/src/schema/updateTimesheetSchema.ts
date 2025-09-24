import z from 'zod';

export const UpdateTimesheetSchema = z.object({
  totalHours: z.number().positive(),
});

export type UpdateTimesheetParams = z.infer<typeof UpdateTimesheetSchema>;
