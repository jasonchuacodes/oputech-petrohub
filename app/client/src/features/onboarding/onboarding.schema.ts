import { z } from 'zod'

export const onboardingSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Enter a tenant name.')
    .max(80, 'Tenant names can contain at most 80 characters.'),
})

export type OnboardingValues = z.infer<typeof onboardingSchema>
