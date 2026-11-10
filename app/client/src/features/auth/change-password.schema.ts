import { z } from 'zod'

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Enter your current password.'),
    newPassword: z.string().min(6, 'Use at least 6 characters.').max(128),
    confirmPassword: z.string().min(1, 'Confirm your new password.'),
  })
  .refine((input) => input.newPassword === input.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match.',
  })

export type ChangePasswordValues = z.infer<typeof changePasswordSchema>
