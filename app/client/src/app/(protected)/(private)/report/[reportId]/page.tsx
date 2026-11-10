import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { ReportDetailPage } from '~/features/reports/report-detail'
import { reportDetailParamsSchema } from '~/features/reports/report-detail/report-detail.schema'

export const metadata: Metadata = { title: 'Shift report' }

export default async function ReportDetailRoute({
  params,
}: {
  params: Promise<{ reportId: string }>
}) {
  const result = reportDetailParamsSchema.safeParse(await params)
  if (!result.success) redirect('/report')

  return <ReportDetailPage reportId={result.data.reportId} />
}
