import { z } from 'zod'
import type { UserRole } from '~/generated/graphql'
import type { UserDeactivationReason } from '~/generated/graphql'

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
const optionalIdentifierSchema = z
  .string()
  .trim()
  .max(80, 'Use no more than 80 characters.')
  .default('')
const optionalAddressSchema = z
  .string()
  .trim()
  .max(500, 'Use no more than 500 characters.')
  .default('')
const optionalBirthdaySchema = z
  .string()
  .trim()
  .refine((value) => value === '' || isValidLocalDate(value), 'Select a valid date.')
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
  sss: optionalIdentifierSchema,
  pagibig: optionalIdentifierSchema,
  philhealth: optionalIdentifierSchema,
  tin: optionalIdentifierSchema,
  birthday: optionalBirthdaySchema,
  address: optionalAddressSchema,
})

export const resetPasswordFormSchema = z.object({
  newPassword: z
    .string()
    .min(1, 'Password is required.')
    .min(6, 'Use at least 6 characters.')
    .max(128, 'Use no more than 128 characters.'),
})

const deactivationReasons = [
  'resign',
  'terminated',
  'other',
] as const satisfies readonly UserDeactivationReason[]

export const deactivateUserFormSchema = z
  .object({
    reason: z.enum(deactivationReasons),
    details: z.string().trim().max(500, 'Use no more than 500 characters.'),
    effectiveDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Select an effective date.'),
  })
  .superRefine((values, context) => {
    if (values.reason === 'other' && !values.details) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['details'],
        message: 'Provide details for this reason.',
      })
    }
  })

export type AddUserFormValues = z.infer<typeof addUserFormSchema>
export type EditUserFormValues = z.infer<typeof editUserFormSchema>
export type AddUserFormInput = z.input<typeof addUserFormSchema>
export type EditUserFormInput = z.input<typeof editUserFormSchema>
export type ResetPasswordFormValues = z.infer<typeof resetPasswordFormSchema>
export type DeactivateUserFormValues = z.infer<typeof deactivateUserFormSchema>

function isValidLocalDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const [year, month, day] = value.split('-').map(Number)
  const date = new Date(Date.UTC(year ?? 0, (month ?? 0) - 1, day ?? 0))
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === (month ?? 0) - 1 &&
    date.getUTCDate() === day
  )
}
