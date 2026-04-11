import z from 'zod';

const updateProductTypePriceSchema = z.object({
  productPrice: z.coerce.number().min(0.01, 'Price must be at least 0.01'),
  effectiveFrom: z.string().optional(),
  future: z.boolean().optional(),
});

const refineFn = (
  data: { future?: boolean; effectiveFrom?: string },
  ctx: z.RefinementCtx,
) => {
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
    if (isNaN(date.getTime())) {
      ctx.addIssue({
        path: ['effectiveFrom'],
        message: 'Effective date is invalid',
        code: z.ZodIssueCode.custom,
      });
    }
  }
};

export const UpdateProductTypePriceSchema = updateProductTypePriceSchema.superRefine(refineFn);
export type UpdateProductTypePriceInput = z.infer<typeof UpdateProductTypePriceSchema>;
