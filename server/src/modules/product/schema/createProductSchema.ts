import z from 'zod';

export const CreateProductSchema = z.object({
  tenantId: z.string().uuid('Invalid tenant ID'),
  name: z.string().min(1, 'Name is required').max(50, 'Name must be at most 50 characters'),
  description: z.string().max(255, 'Description must be at most 255 characters').optional(),
  price: z.coerce.number().min(0.01),
  reading: z.coerce.number().min(1),
  effectiveFrom: z.string().datetime().optional().default(() => new Date().toISOString()),
});

export type CreateProductPayload = z.infer<typeof CreateProductSchema>;
