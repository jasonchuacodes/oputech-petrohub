import z from 'zod';

const updateProductSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50),
  description: z.string().max(255).optional(),
  reading: z.coerce.number().min(0.001),
  color: z.enum(['grey', 'error', 'warning', 'success', 'info', 'primary']).optional(),
});

export const UpdateProductSchema = updateProductSchema;
export type UpdateProductInput = z.infer<typeof UpdateProductSchema>;
