import z from 'zod';

export const UpdateStockInventorySchema = z.object({
  name: z.string().min(1).max(50).optional(),
  description: z.string().max(255).optional(),
  price: z.coerce.number().min(0.01).optional(),
  quantity: z.coerce.number().int().min(0).optional(),
  effectiveFrom: z.string().datetime().optional(),
});

export type UpdateStockInventoryPayload = z.infer<typeof UpdateStockInventorySchema>;
