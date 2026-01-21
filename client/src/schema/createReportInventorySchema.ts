import z from 'zod';

export const CreateReportInventorySchema = z.object({
  productId: z.string().min(1, 'Product is required'),
  quantity: z.coerce.number().int().min(1, 'Quantity must be at least 1'),
});

export type CreateReportInventoryInput = z.infer<typeof CreateReportInventorySchema>;
