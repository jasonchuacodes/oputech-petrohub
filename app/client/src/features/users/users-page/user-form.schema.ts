import { z } from 'zod'
import type { UserRole } from '~/generated/graphql'

const usernameSchema = z
  .string()
  .trim()
  .min(1, 'Username is required.')
  .min(3, 'Use at least 3 characters.')
  .max(80, 'Use no more than 80 characters.')

const optionalNameSchema = z
  .string()
  .trim()
  .max(80, 'Use no more than 80 characters.')
  .default('')
const manageableUserRoles = ['admin', 'member'] as const satisfies readonly UserRole[]
const roleSchema = z.enum(manageableUserRoles)

export const addUserFormSchema = z.object({
  username: usernameSchema,
  password: z
    .string()
    .min(1, 'Password is required.')
    .min(6, 'Use at least 6 characters.')
    .max(128, 'Use no more than 128 characters.'),
  role: roleSchema.default('member'),
})

export const editUserFormSchema = z.object({
  username: usernameSchema,
  firstName: optionalNameSchema,
  lastName: optionalNameSchema,
  role: roleSchema,
})

export const resetPasswordFormSchema = z
  .object({
    newPassword: z
      .string()
      .min(1, 'Password is required.')
      .min(6, 'Use at least 6 characters.')
      .max(128, 'Use no more than 128 characters.'),
    confirmPassword: z.string().min(1, 'Confirm the new password.'),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match.',
  })

export type AddUserFormValues = z.infer<typeof addUserFormSchema>
export type EditUserFormValues = z.infer<typeof editUserFormSchema>
export type AddUserFormInput = z.input<typeof addUserFormSchema>
export type EditUserFormInput = z.input<typeof editUserFormSchema>
export type ResetPasswordFormValues = z.infer<typeof resetPasswordFormSchema>
