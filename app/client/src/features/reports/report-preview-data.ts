export const REPORT_PREVIEW_ID = 'preview-2026-11-10-second-shift' as const

export type ReportPreviewId = typeof REPORT_PREVIEW_ID
export type ReportShiftId = 'first' | 'second'

type SubmittedShiftPreview = {
  id: ReportShiftId
  ordinal: string
  time: string
  state: 'submitted'
  submittedBy: string
}

type AvailableShiftPreview = {
  id: ReportShiftId
  ordinal: string
  time: string
  state: 'available'
  previewReportId: ReportPreviewId
}

export type ReportShiftPreview = SubmittedShiftPreview | AvailableShiftPreview

export const reportPreviewDate = {
  iso: '2026-11-10',
  label: 'November 10, 2026',
} as const

export const reportShiftPreviews = [
  {
    id: 'first',
    ordinal: '1st shift',
    time: '5:00 AM–1:00 PM',
    state: 'submitted',
    submittedBy: 'Rolando',
  },
  {
    id: 'second',
    ordinal: '2nd shift',
    time: '1:00 PM–9:00 PM',
    state: 'available',
    previewReportId: REPORT_PREVIEW_ID,
  },
] as const satisfies readonly ReportShiftPreview[]

export const reportDetailPreview = {
  id: REPORT_PREVIEW_ID,
  status: 'draft',
  date: reportPreviewDate,
  shift: reportShiftPreviews[1],
} as const
