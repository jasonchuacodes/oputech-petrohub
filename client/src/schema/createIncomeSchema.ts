import z from 'zod';

export const CreateIncomeSchema = z.object({
  description: z.string().min(1, 'Description is required').max(255),
  amount: z.coerce.number().min(0.01, 'Amount must be at least ₱0.01'),
});

export type CreateIncomeInput = z.infer<typeof CreateIncomeSchema>;
