import { describe, expect, it } from 'vitest'
import { profileFormSchema } from './profile-form.schema'

describe('account profile form', () => {
  it('trims the first and last names', () => {
    expect(
      profileFormSchema.parse({ firstName: '  Maria Clara  ', lastName: '  Santos  ' }),
    ).toEqual({
      firstName: 'Maria Clara',
      lastName: 'Santos',
    })
  })

  it('allows either name to be cleared', () => {
    expect(profileFormSchema.parse({ firstName: '', lastName: '' })).toEqual({
      firstName: '',
      lastName: '',
    })
  })
})
