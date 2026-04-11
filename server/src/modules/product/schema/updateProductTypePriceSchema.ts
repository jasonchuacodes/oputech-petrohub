import z from 'zod';

export const UpdateProductTypePriceSchema = z.object({
  tenantId: z.string().uuid('Invalid tenant ID'),
  productPrice: z.number().positive().min(0.01),
  effectiveFrom: z.string().datetime().optional(),
});

export type UpdateProductTypePricePayload = z.infer<typeof UpdateProductTypePriceSchema>;
