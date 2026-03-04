import { z } from 'zod';
import { RateType } from '~/db/prisma';

export const CreateSalaryRateSchema = z.object({
  userId: z.string().uuid(),
  tenantId: z.string().uuid(),
  rate: z.number().positive(),
  rateType: z.nativeEnum(RateType),
  effectiveFrom: z.string().datetime().optional(),
});

export type CreateSalaryRateInput = z.infer<typeof CreateSalaryRateSchema>;
