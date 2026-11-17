import { Types } from 'mongoose'
import { z } from 'zod'
import { UserRole } from './schemas/user.schema'
import { UserDeactivationReason } from './schemas/user-tenant-deactivation.schema'
import { TenantUserAvailability } from './user-tenant-membership'

const usernameSchema = z.string().trim().min(3).max(80).toLowerCase()
const optionalNameSchema = z
  .string()
  .trim()
  .max(80)
  .nullish()
  .transform((value) => value || undefined)
const managedRoleSchema = z.enum([UserRole.ADMIN, UserRole.MEMBER])
const passwordSchema = z.string().min(6, 'Use at least 6 characters.').max(128)
const optionalIdentifierSchema = z
  .string()
  .trim()
  .max(80)
  .nullable()
  .optional()
  .transform((value) => (value === undefined ? undefined : value || null))
const optionalAddressSchema = z
  .string()
  .trim()
  .max(500)
  .nullable()
  .optional()
  .transform((value) => (value === undefined ? undefined : value || null))
const optionalBirthdaySchema = z
  .string()
  .trim()
  .nullable()
  .optional()
  .transform((value) => (value === undefined ? undefined : value || null))
  .refine((value) => value === null || value === undefined || isValidLocalDate(value), {
    message: 'Use a valid date.',
  })

export const usersInputSchema = z
  .object({
    offset: z.number().int().min(0).default(0),
    limit: z.number().int().min(1).max(100).default(20),
    availability: z.nativeEnum(TenantUserAvailability).default(TenantUserAvailability.ACTIVE),
  })
  .strict()

export const userDetailsInputSchema = z
  .object({
    userId: z.instanceof(Types.ObjectId),
  })
  .strict()

export const createUserInputSchema = z
  .object({
    username: usernameSchema,
    password: passwordSchema,
    role: managedRoleSchema.default(UserRole.MEMBER),
  })
  .strict()

export const updateMyProfileInputSchema = z
  .object({
    firstName: optionalNameSchema,
    lastName: optionalNameSchema,
  })
  .strict()

export const updateUserInputSchema = z
  .object({
    userId: z.instanceof(Types.ObjectId),
    username: usernameSchema,
    firstName: optionalNameSchema,
    lastName: optionalNameSchema,
    role: managedRoleSchema,
    sss: optionalIdentifierSchema,
    pagibig: optionalIdentifierSchema,
    philhealth: optionalIdentifierSchema,
    tin: optionalIdentifierSchema,
    birthday: optionalBirthdaySchema,
    address: optionalAddressSchema,
  })
  .strict()

export const deleteUserInputSchema = z
  .object({
    userId: z.instanceof(Types.ObjectId),
  })
  .strict()

export const deactivateUserInputSchema = z
  .object({
    userId: z.instanceof(Types.ObjectId),
    reason: z.nativeEnum(UserDeactivationReason),
    details: z
      .string()
      .trim()
      .max(500)
      .nullish()
      .transform((value) => value || undefined),
    effectiveDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  })
  .strict()
  .superRefine((input, context) => {
    if (input.reason === UserDeactivationReason.OTHER && !input.details) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['details'],
        message: 'Provide details for this reason.',
      })
    }
  })

export const resetUserPasswordInputSchema = z
  .object({
    userId: z.instanceof(Types.ObjectId),
    newPassword: passwordSchema,
  })
  .strict()

export type UsersInput = z.infer<typeof usersInputSchema>
export type UserDetailsInput = z.infer<typeof userDetailsInputSchema>
export type CreateUserInput = z.infer<typeof createUserInputSchema>
export type UpdateMyProfileInput = z.infer<typeof updateMyProfileInputSchema>
export type UpdateUserInput = z.infer<typeof updateUserInputSchema>
export type DeleteUserInput = z.infer<typeof deleteUserInputSchema>
export type DeactivateUserInput = z.infer<typeof deactivateUserInputSchema>
export type ResetUserPasswordInput = z.infer<typeof resetUserPasswordInputSchema>

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
