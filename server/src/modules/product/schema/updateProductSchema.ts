import z from 'zod';

export const UpdateProductSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(50, 'Name must be at most 50 characters')
    .optional(),
  description: z.string().max(255, 'Description must be at most 255 characters').optional(),
  productReading: z
    .number()
    .min(1, 'Product reading must be at least 1')
    .optional(),
  color: z.enum(['grey', 'error', 'warning', 'success', 'info', 'primary']).optional(),
});

export type UpdateProductPayload = z.infer<typeof UpdateProductSchema>;
