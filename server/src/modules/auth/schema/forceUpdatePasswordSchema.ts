import { z } from 'zod';

export const ForceUpdatePasswordSchema = z.object({
  id: z.string().uuid().optional(),
  newPassword: z.string().min(6, 'Password must be at least 8 characters'),
});

export type ForceUpdatePasswordInput = z.infer<typeof ForceUpdatePasswordSchema>;
