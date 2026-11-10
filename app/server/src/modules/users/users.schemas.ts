import { Types } from 'mongoose'
import { z } from 'zod'
import { UserRole } from './schemas/user.schema'

const usernameSchema = z.string().trim().min(3).max(80).toLowerCase()
const optionalNameSchema = z
  .string()
  .trim()
  .max(80)
  .nullish()
  .transform((value) => value || undefined)
const managedRoleSchema = z.enum([UserRole.ADMIN, UserRole.MEMBER])
const passwordSchema = z.string().min(6, 'Use at least 6 characters.').max(128)

export const usersInputSchema = z
  .object({
    offset: z.number().int().min(0).default(0),
    limit: z.number().int().min(1).max(100).default(20),
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
  })
  .strict()

export const deleteUserInputSchema = z
  .object({
    userId: z.instanceof(Types.ObjectId),
  })
  .strict()

export const resetUserPasswordInputSchema = z
  .object({
    userId: z.instanceof(Types.ObjectId),
    newPassword: passwordSchema,
  })
  .strict()

export type UsersInput = z.infer<typeof usersInputSchema>
export type CreateUserInput = z.infer<typeof createUserInputSchema>
export type UpdateMyProfileInput = z.infer<typeof updateMyProfileInputSchema>
export type UpdateUserInput = z.infer<typeof updateUserInputSchema>
export type DeleteUserInput = z.infer<typeof deleteUserInputSchema>
export type ResetUserPasswordInput = z.infer<typeof resetUserPasswordInputSchema>
