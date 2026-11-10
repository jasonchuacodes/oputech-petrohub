import { z } from 'zod'
import { REPORT_PREVIEW_ID } from '../report-preview-data'

export const reportDetailParamsSchema = z.object({
  reportId: z.literal(REPORT_PREVIEW_ID),
})
