import { z } from 'zod'

const username = z.string().trim().min(3).max(80).toLowerCase()
const password = z.string().min(6, 'Use at least 6 characters.').max(128)

export const registerSchema = z
  .object({
    username,
    password,
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
    newPassword: password,
  })
  .strict()

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>
