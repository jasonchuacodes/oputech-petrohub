import z from "zod";

export const CreateTimesheetSchema = z.object({
  userId: z.string().uuid(),
})

export type CreateTimesheetPayload = z.infer<typeof CreateTimesheetSchema>;