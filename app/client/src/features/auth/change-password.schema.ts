import { z } from 'zod'

export const changePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(1, 'Enter your current password.')
    .max(256, 'Use no more than 256 characters.'),
  newPassword: z.string().min(6, 'Use at least 6 characters.').max(128),
})

export type ChangePasswordValues = z.infer<typeof changePasswordSchema>
