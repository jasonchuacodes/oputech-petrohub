import z from 'zod';

export const CreateProductSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50),
  description: z.string().max(255).optional(),
  price: z.coerce.number().min(0.01),
  reading: z.coerce.number().min(0.001),
  effectiveFrom: z.string().optional(),
});

export type CreateProductInput = z.infer<typeof CreateProductSchema>;
