import z from 'zod';
import { ProductType } from '~/services/product/product.types';

export const CreateProductSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50),
  description: z.string().max(255).optional(),
  price: z.coerce.number().min(0.01),
  reading: z.coerce.number().min(0.001),
  future: z.boolean().optional(),
  color: z.enum(['grey', 'error', 'warning', 'success', 'info', 'primary']).optional(),
  type: z.nativeEnum(ProductType),
});

export type CreateProductInput = z.infer<typeof CreateProductSchema>;
