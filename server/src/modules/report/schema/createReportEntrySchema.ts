import z from 'zod';
import { Decimal } from '@prisma/client/runtime/library';

export const CreateReportEntrySchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().positive().transform((val) => new Decimal(val)),
});

export type CreateReportEntryPayload = z.infer<typeof CreateReportEntrySchema>;
