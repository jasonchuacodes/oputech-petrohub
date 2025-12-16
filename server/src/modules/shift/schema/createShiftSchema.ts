import z from 'zod';

export const CreateShiftSchema = z
  .object({
    tenantId: z.string().uuid(),
    name: z.string().min(1).max(50),
    shiftStart: z.string().datetime(),
    shiftEnd: z.string().datetime(),
  })
  .refine(
    (data) => {
      const start = new Date(data.shiftStart);
      const end = new Date(data.shiftEnd);
      return end > start;
    },
    {
      message: 'Shift end must be after shift start',
      path: ['shiftEnd'],
    },
  );

export type CreateShiftPayload = z.infer<typeof CreateShiftSchema>;
