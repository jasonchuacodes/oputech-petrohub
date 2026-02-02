import z from 'zod';

const updateProductSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50),
  description: z.string().max(255).optional(),
  price: z.coerce.number().min(0.01),
  reading: z.coerce.number().min(0.001),
  effectiveFrom: z.string().optional(),
  future: z.boolean().optional(),
  color: z.enum(['grey', 'error', 'warning', 'success', 'info', 'primary']).optional(),
});

const refineFn = (data: { future?: boolean; effectiveFrom?: string }, ctx: z.RefinementCtx) => {
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
};

export const UpdateProductSchema = updateProductSchema.superRefine(refineFn);
export type UpdateProductInput = z.infer<typeof UpdateProductSchema>;
