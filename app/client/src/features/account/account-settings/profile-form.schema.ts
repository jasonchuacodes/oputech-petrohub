import { z } from 'zod'

const nameSchema = z.string().trim().max(80, 'Use no more than 80 characters.')

export const profileFormSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
})

export type ProfileFormValues = z.infer<typeof profileFormSchema>
