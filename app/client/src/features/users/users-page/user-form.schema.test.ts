import { describe, expect, it } from 'vitest'
import {
  addUserFormSchema,
  deactivateUserFormSchema,
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

  it('requires details for an other deactivation reason', () => {
    expect(
      deactivateUserFormSchema.safeParse({
        reason: 'other',
        details: '   ',
        effectiveDate: '2026-11-16',
      }).success,
    ).toBe(false)
    expect(
      deactivateUserFormSchema.parse({
        reason: 'other',
        details: 'Relocated outside the service area',
        effectiveDate: '2026-11-16',
      }),
    ).toMatchObject({ reason: 'other', details: 'Relocated outside the service area' })
  })
})
