import z from 'zod';

export const AssignEmployeeSchema = z.object({
  userId: z.string().uuid(),
});

export type AssignEmployeePayload = z.infer<typeof AssignEmployeeSchema>;
