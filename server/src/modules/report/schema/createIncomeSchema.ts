import z from 'zod';
import { Decimal } from '@prisma/client/runtime/library';

export const CreateIncomeSchema = z.object({
  description: z.string().min(1).max(255),
  amount: z.number().positive().transform((val) => new Decimal(val)),
});

export type CreateIncomePayload = z.infer<typeof CreateIncomeSchema>;
