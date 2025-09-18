import z from "zod";

export const CreateTimesheetEntrySchema = z.object({
  tenantId: z.string().uuid(),
})

export type CreateTimesheetEntryParams = z.infer<typeof CreateTimesheetEntrySchema>;
