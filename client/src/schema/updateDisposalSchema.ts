import z from 'zod';

export const UpdateDisposalSchema = z.object({
  afterReading: z.coerce.number().min(0, 'After reading must be at least 0'),
});

export type UpdateDisposalInput = z.infer<typeof UpdateDisposalSchema>;
