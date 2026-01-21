import z from 'zod';

export const CreateReportInventorySchema = z.object({
  productId: z.string().uuid(),
  quantity: z.coerce.number().int().min(1),
});

export type CreateReportInventoryPayload = z.infer<typeof CreateReportInventorySchema>;
