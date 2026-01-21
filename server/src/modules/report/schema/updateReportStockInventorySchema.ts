import z from 'zod';

export const UpdateReportStockInventorySchema = z.object({
  quantitySold: z.coerce.number().int().min(1),
});

export type UpdateReportStockInventoryPayload = z.infer<typeof UpdateReportStockInventorySchema>;
