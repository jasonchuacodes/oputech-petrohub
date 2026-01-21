import z from 'zod';

export const CreateExpenseSchema = z.object({
  description: z.string().min(1, 'Description is required').max(255),
  amount: z.coerce.number().min(1, 'Amount must be at least ₱1.00'),
});

export type CreateExpenseInput = z.infer<typeof CreateExpenseSchema>;
