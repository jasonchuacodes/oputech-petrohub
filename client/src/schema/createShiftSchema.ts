import z from 'zod';

export const CreateShiftSchema = z
  .object({
    name: z.string().min(1, 'Name is required').max(50),
    shiftStart: z.date({ required_error: 'Shift start is required' }),
    shiftEnd: z.date({ required_error: 'Shift end is required' }),
  })
  .refine((data) => data.shiftEnd > data.shiftStart, {
    message: 'Shift end must be after shift start',
    path: ['shiftEnd'],
  });

export type CreateShiftInput = z.infer<typeof CreateShiftSchema>;
