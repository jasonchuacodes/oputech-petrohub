import z from 'zod';

export const SelectShiftSchema = z.object({
  shiftId: z.string().min(1, 'Shift is required'),
});

export type SelectShiftInput = z.infer<typeof SelectShiftSchema>;
