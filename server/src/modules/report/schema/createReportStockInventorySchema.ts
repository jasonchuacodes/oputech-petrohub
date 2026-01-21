import z from 'zod';

export const CreateReportStockInventorySchema = z.object({
  productId: z.string().uuid(),
  quantitySold: z.coerce.number().int().min(1),
});

export type CreateReportStockInventoryPayload = z.infer<typeof CreateReportStockInventorySchema>;
