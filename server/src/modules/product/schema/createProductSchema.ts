import z from 'zod';
import { ProductType } from '~/db/prisma';

export const CreateProductSchema = z.object({
  tenantId: z.string().uuid('Invalid tenant ID'),
  name: z.string().min(1, 'Name is required').max(50, 'Name must be at most 50 characters'),
  description: z.string().max(255, 'Description must be at most 255 characters').optional(),
  price: z.coerce.number().min(0.01),
  reading: z.coerce.number().min(1),
  color: z.enum(['grey', 'error', 'warning', 'success', 'info', 'primary']).default('grey'),
  type: z.nativeEnum(ProductType),
});

export type CreateProductPayload = z.infer<typeof CreateProductSchema>;
