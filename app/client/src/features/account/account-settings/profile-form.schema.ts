import { z } from 'zod'

const nameSchema = z.string().trim().max(80, 'Use no more than 80 characters.')
const identifierSchema = z.string().trim().max(80, 'Use no more than 80 characters.').default('')
const addressSchema = z.string().trim().max(500, 'Use no more than 500 characters.').default('')
const birthdaySchema = z
  .string()
  .trim()
  .refine((value) => value === '' || isValidLocalDate(value), 'Select a valid date.')
  .default('')

export const profileFormSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  birthday: birthdaySchema,
  address: addressSchema,
  sss: identifierSchema,
  pagibig: identifierSchema,
  philhealth: identifierSchema,
  tin: identifierSchema,
})

export type ProfileFormInput = z.input<typeof profileFormSchema>
export type ProfileFormValues = z.output<typeof profileFormSchema>

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
