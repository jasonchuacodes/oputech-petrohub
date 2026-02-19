import { z } from 'zod';
import { ProductCategory } from '~/db/prisma';

export const GetProductsSchema = z.object({
  tenantId: z.string(),
  category: z.nativeEnum(ProductCategory).optional(),
  searchTerm: z.string().min(1).optional(),
});

export type GetProductsInput = z.infer<typeof GetProductsSchema>;
