import z from 'zod';

export const CreateInventorySchema = z.object({
  tenantId: z.string().uuid('Invalid tenant ID'),
  name: z.string().min(1, 'Name is required').max(50),
  description: z.string().max(255).optional(),
  price: z.coerce.number().min(0.01, 'Price must be greater than 0'),
  quantity: z.coerce.number().int().min(0, 'Quantity cannot be negative').optional(),
});

export type CreateInventoryPayload = z.infer<typeof CreateInventorySchema>;
