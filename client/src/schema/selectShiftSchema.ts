import z from 'zod';

export const SelectShiftSchema = z.object({
  periodKey: z.string().min(1, 'Shift period is required'),
});

export type SelectShiftInput = z.infer<typeof SelectShiftSchema>;
