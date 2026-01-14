import z from 'zod';

export const CreateProductSchema = z
  .object({
    name: z.string().min(1, 'Name is required').max(50),
    description: z.string().max(255).optional(),
    price: z.coerce.number().min(0.01),
    reading: z.coerce.number().min(0.001),
    effectiveFrom: z.string().optional(),
    future: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.future) {
      if (!data.effectiveFrom) {
        ctx.addIssue({
          path: ['effectiveFrom'],
          message: 'Effective date is required',
          code: z.ZodIssueCode.custom,
        });
        return;
      }

      const date = new Date(data.effectiveFrom);
      if (isNaN(date.getTime()) || date < new Date()) {
        ctx.addIssue({
          path: ['effectiveFrom'],
          message: 'Effective date must be in the future',
          code: z.ZodIssueCode.custom,
        });
      }
    }
  });

export type CreateProductInput = z.infer<typeof CreateProductSchema>;
