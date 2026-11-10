import { z } from 'zod'

export const onboardingSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Enter a station name.')
    .max(80, 'Station names can contain at most 80 characters.'),
})

export type OnboardingValues = z.infer<typeof onboardingSchema>
