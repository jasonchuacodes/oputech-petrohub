import z from 'zod';

export const UpdateShiftSchema = z
  .object({
    name: z.string().min(1).max(50).optional(),
    shiftStart: z.string().datetime().optional(),
    shiftEnd: z.string().datetime().optional(),
  })
  .refine(
    (data) => {
      if (data.shiftStart && data.shiftEnd) {
        const start = new Date(data.shiftStart);
        const end = new Date(data.shiftEnd);
        return end > start;
      }
      return true;
    },
    {
      message: 'Shift end must be after shift start',
      path: ['shiftEnd'],
    },
  );

export type UpdateShiftPayload = z.infer<typeof UpdateShiftSchema>;
