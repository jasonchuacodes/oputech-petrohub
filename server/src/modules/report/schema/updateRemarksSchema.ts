import z from 'zod';

export const UpdateRemarksSchema = z.object({
  remarks: z.string().max(1000).nullable().optional(),
});

export type UpdateRemarksPayload = z.infer<typeof UpdateRemarksSchema>;
