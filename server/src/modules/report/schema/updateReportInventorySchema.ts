import z from 'zod';

export const UpdateReportInventorySchema = z.object({
  quantity: z.coerce.number().int().min(1),
});

export type UpdateReportInventoryPayload = z.infer<typeof UpdateReportInventorySchema>;
