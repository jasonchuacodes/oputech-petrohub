import { z } from 'zod'

const username = z.string().trim().min(3).max(80).toLowerCase()
const strongPassword = z
  .string()
  .min(12, 'Use at least 12 characters.')
  .max(128)
  .regex(/[a-z]/, 'Include a lowercase letter.')
  .regex(/[A-Z]/, 'Include an uppercase letter.')
  .regex(/[0-9]/, 'Include a number.')

export const registerSchema = z
  .object({
    username,
    password: strongPassword,
  })
  .strict()

export const loginSchema = z
  .object({
    username,
    password: z.string().min(1).max(256),
  })
  .strict()

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1).max(256),
    newPassword: strongPassword,
  })
  .strict()

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>
