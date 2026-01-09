import z from 'zod';
import { Decimal } from '@prisma/client/runtime/library';

export const CreateExpenseSchema = z.object({
  description: z.string().min(1).max(255),
  amount: z.number().positive().transform((val) => new Decimal(val)),
});

export type CreateExpensePayload = z.infer<typeof CreateExpenseSchema>;
