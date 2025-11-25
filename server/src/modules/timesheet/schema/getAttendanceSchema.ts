import z from 'zod';

export const GetAttendanceSchema = z.object({
  tenantId: z.string().uuid(),
});

export type GetAttendanceInput = z.infer<typeof GetAttendanceSchema>;
