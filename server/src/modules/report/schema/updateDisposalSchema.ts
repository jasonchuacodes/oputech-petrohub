import z from 'zod';
import { Decimal } from '@prisma/client/runtime/library';

export const UpdateDisposalSchema = z.object({
  afterReading: z.number().positive().transform((val) => new Decimal(val)),
});

export type UpdateDisposalPayload = z.infer<typeof UpdateDisposalSchema>;
