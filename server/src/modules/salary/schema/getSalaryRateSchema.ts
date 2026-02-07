import { z } from 'zod';

export const GetSalaryRateSchema = z.object({
  userId: z.string().uuid(),
  tenantId: z.string().uuid(),
});

export type GetSalaryRateInput = z.infer<typeof GetSalaryRateSchema>;
