import z from 'zod';

export const UpdateProductSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(50, 'Name must be at most 50 characters')
    .optional(),
  description: z.string().max(255, 'Description must be at most 255 characters').optional(),
  productPrice: z
    .number()
    .positive('Product price must be positive')
    .min(0.01, 'Product price must be at least 0.01')
    .optional(),
  productReading: z
    .number()
    .min(1, 'Product price must be at least 1')
    .optional(),
  effectiveFrom: z
    .string()
    .datetime()
    .optional()
    .default(() => new Date().toISOString()),
});

export type UpdateProductPayload = z.infer<typeof UpdateProductSchema>;
