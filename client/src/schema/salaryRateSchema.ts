import { z } from 'zod';
import { RateType } from '../services/salary/salary.types';

export const CreateSalaryRateSchema = z.object({
  rate: z.coerce
    .number({
      required_error: 'Rate is required',
      invalid_type_error: 'Rate must be a number',
    })
    .nonnegative('Rate must be zero or greater'),
  rateType: z.nativeEnum(RateType, {
    required_error: 'Rate type is required',
  }),
  effectiveFrom: z.string().optional(),
});

export type CreateSalaryRateFormData = z.infer<typeof CreateSalaryRateSchema>;
