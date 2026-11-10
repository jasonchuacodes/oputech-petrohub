import { describe, expect, it } from 'vitest'
import {
  addUserFormSchema,
  editUserFormSchema,
  resetPasswordFormSchema,
} from './user-form.schema'

describe('user form schemas', () => {
  it('requires only a username and password when adding a user', () => {
    expect(
      addUserFormSchema.parse({ username: '  NewUser  ', password: 'secret password' }),
    ).toEqual({
      username: 'NewUser',
      password: 'secret password',
      role: 'member',
    })
  })

  it('preserves password whitespace', () => {
    expect(
      addUserFormSchema.parse({ username: 'new-user', password: '  secret  ' }).password,
    ).toBe('  secret  ')
  })

  it('accepts only manageable roles', () => {
    expect(
      editUserFormSchema.safeParse({
        username: 'new-user',
        firstName: '',
        lastName: '',
        role: 'superadmin',
      }).success,
    ).toBe(false)
  })

  it('validates reset passwords without trimming them', () => {
    expect(
      resetPasswordFormSchema.parse({
        newPassword: '  secret  ',
      }).newPassword,
    ).toBe('  secret  ')
    expect(resetPasswordFormSchema.safeParse({ newPassword: 'short' }).success).toBe(false)
  })
})
