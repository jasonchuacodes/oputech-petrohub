import { z } from 'zod'
import { Types } from 'mongoose'

export const createTenantInputSchema = z
  .object({
    name: z.string().trim().min(1).max(80),
  })
  .strict()

export type CreateTenantInput = z.infer<typeof createTenantInputSchema>

export const updateTenantInputSchema = z
  .object({
    tenantId: z.instanceof(Types.ObjectId),
    name: z.string().trim().min(1).max(80),
  })
  .strict()

export type UpdateTenantInput = z.infer<typeof updateTenantInputSchema>

export const deleteTenantInputSchema = z
  .object({
    tenantId: z.instanceof(Types.ObjectId),
  })
  .strict()

export type DeleteTenantInput = z.infer<typeof deleteTenantInputSchema>

const timeSchema = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Use a valid 24-hour time.')
const shiftNameSchema = z
  .string()
  .transform((value) => value.trim().replace(/\s+/g, ' '))
  .pipe(z.string().min(1, 'Shift name is required.').max(80, 'Shift name cannot exceed 80 characters.'))
const shiftFieldsSchema = z
  .object({
    name: shiftNameSchema,
    startTime: timeSchema,
    endTime: timeSchema,
  })

function validateShiftTimes<T extends z.ZodType<{ startTime: string; endTime: string }>>(schema: T) {
  return schema.refine((shift) => shift.startTime !== shift.endTime, {
    message: 'Shift start and end times must be different.',
    path: ['endTime'],
  })
}

export const createShiftInputSchema = validateShiftTimes(shiftFieldsSchema.strict())

export type CreateShiftInput = z.infer<typeof createShiftInputSchema>

export const updateShiftInputSchema = validateShiftTimes(
  shiftFieldsSchema.extend({ shiftId: z.instanceof(Types.ObjectId) }).strict(),
)

export type UpdateShiftInput = z.infer<typeof updateShiftInputSchema>

export const deleteShiftInputSchema = z.object({ shiftId: z.instanceof(Types.ObjectId) }).strict()

export type DeleteShiftInput = z.infer<typeof deleteShiftInputSchema>

const recurringIncomeDescriptionSchema = z
  .string()
  .transform((value) => value.trim().replace(/\s+/g, ' '))
  .pipe(z.string().min(1, 'Description is required.').max(120))

const recurringIncomeFieldInputSchema = z
  .object({
    id: z.instanceof(Types.ObjectId).nullish().transform((value) => value ?? null),
    description: recurringIncomeDescriptionSchema,
    active: z.boolean(),
  })
  .strict()

export const updateRecurringIncomeConfigurationInputSchema = z
  .object({
    expectedRevision: z.number().int().min(0),
    fields: z.array(recurringIncomeFieldInputSchema).max(200),
  })
  .strict()
  .superRefine((input, context) => {
    const ids = input.fields
      .map((field) => field.id?.toHexString())
      .filter((id): id is string => Boolean(id))
    if (new Set(ids).size !== ids.length) {
      context.addIssue({ code: 'custom', message: 'Income field identifiers must be unique.', path: ['fields'] })
    }

    const activeFields = input.fields.filter((field) => field.active)
    if (activeFields.length > 100) {
      context.addIssue({ code: 'custom', message: 'A tenant can have up to 100 active income fields.', path: ['fields'] })
    }
    const descriptions = input.fields.map((field) => field.description.toLocaleLowerCase())
    if (new Set(descriptions).size !== descriptions.length) {
      context.addIssue({ code: 'custom', message: 'Income field descriptions must be unique.', path: ['fields'] })
    }
  })

export type UpdateRecurringIncomeConfigurationInput = z.infer<
  typeof updateRecurringIncomeConfigurationInputSchema
>
