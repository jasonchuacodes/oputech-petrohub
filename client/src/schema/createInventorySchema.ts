import z from 'zod';

export const CreateInventorySchema = z.object({
  name: z.string().min(1, 'Product name is required').max(50),
  description: z.string().optional().nullable(),
  quantity: z.coerce.number().int().min(0, 'Quantity cannot be negative'),
  price: z.coerce.number().min(0.01, 'Price must be greater than 0'),
});

export type CreateInventoryInput = z.infer<typeof CreateInventorySchema>;
