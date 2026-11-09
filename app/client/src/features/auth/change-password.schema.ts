import { z } from 'zod'

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Enter your current password.'),
    newPassword: z
      .string()
      .min(12, 'Use at least 12 characters.')
      .max(128)
      .regex(/[a-z]/, 'Include a lowercase letter.')
      .regex(/[A-Z]/, 'Include an uppercase letter.')
      .regex(/[0-9]/, 'Include a number.'),
    confirmPassword: z.string().min(1, 'Confirm your new password.'),
  })
  .refine((input) => input.newPassword === input.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match.',
  })

export type ChangePasswordValues = z.infer<typeof changePasswordSchema>
