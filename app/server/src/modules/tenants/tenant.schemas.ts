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
const shiftTimesSchema = z
  .object({
    startTime: timeSchema,
    endTime: timeSchema,
  })
  .refine((shift) => shift.startTime !== shift.endTime, {
    message: 'Shift start and end times must be different.',
    path: ['endTime'],
  })

export const createShiftInputSchema = shiftTimesSchema

export type CreateShiftInput = z.infer<typeof createShiftInputSchema>

export const updateShiftInputSchema = shiftTimesSchema.and(
  z.object({ shiftId: z.instanceof(Types.ObjectId) }),
)

export type UpdateShiftInput = z.infer<typeof updateShiftInputSchema>

export const deleteShiftInputSchema = z.object({ shiftId: z.instanceof(Types.ObjectId) }).strict()

export type DeleteShiftInput = z.infer<typeof deleteShiftInputSchema>
