import { z } from 'zod'

export const incomeFieldDescriptionSchema = z
  .string()
  .transform((value) => value.trim().replace(/\s+/g, ' '))
  .pipe(z.string().min(1, 'Description is required').max(120))

const incomeFieldSchema = z.object({
  id: z.string().nullable(),
  description: incomeFieldDescriptionSchema,
  active: z.boolean(),
})

export const addIncomeFieldFormSchema = z.object({ description: incomeFieldDescriptionSchema })
export type AddIncomeFieldFormValues = z.infer<typeof addIncomeFieldFormSchema>

export const incomeSetupFormSchema = z
  .object({ fields: z.array(incomeFieldSchema).max(200) })
  .superRefine((values, context) => {
    const active = values.fields.filter((field) => field.active)
    if (active.length > 100) {
      context.addIssue({ code: 'custom', message: 'You can configure up to 100 active fields', path: ['fields'] })
    }
    const seen = new Set<string>()
    values.fields.forEach((field, index) => {
      const description = field.description.toLocaleLowerCase()
      if (seen.has(description)) {
        context.addIssue({ code: 'custom', message: 'Field names must be unique', path: ['fields', index, 'description'] })
      }
      seen.add(description)
    })
  })

export type IncomeSetupFormValues = z.infer<typeof incomeSetupFormSchema>
