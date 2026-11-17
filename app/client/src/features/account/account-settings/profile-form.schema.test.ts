import { describe, expect, it } from 'vitest'
import { profileFormSchema } from './profile-form.schema'

describe('account profile form', () => {
  it('trims the first and last names', () => {
    expect(
      profileFormSchema.parse({ firstName: '  Maria Clara  ', lastName: '  Santos  ' }),
    ).toEqual({
      firstName: 'Maria Clara',
      lastName: 'Santos',
      birthday: '',
      address: '',
      sss: '',
      pagibig: '',
      philhealth: '',
      tin: '',
    })
  })

  it('allows either name to be cleared', () => {
    expect(profileFormSchema.parse({ firstName: '', lastName: '' })).toEqual({
      firstName: '',
      lastName: '',
      birthday: '',
      address: '',
      sss: '',
      pagibig: '',
      philhealth: '',
      tin: '',
    })
  })

  it('validates and trims optional profile details', () => {
    expect(
      profileFormSchema.parse({
        firstName: '',
        lastName: '',
        birthday: '2000-02-29',
        address: '  Line 1\nLine 2  ',
        sss: '  00-123  ',
        pagibig: ' 01-234 ',
        philhealth: ' 02-345 ',
        tin: ' 000-111 ',
      }),
    ).toMatchObject({
      birthday: '2000-02-29',
      address: 'Line 1\nLine 2',
      sss: '00-123',
      pagibig: '01-234',
      philhealth: '02-345',
      tin: '000-111',
    })

    expect(
      profileFormSchema.safeParse({ firstName: '', lastName: '', birthday: '2001-02-29' })
        .success,
    ).toBe(false)
  })
})
