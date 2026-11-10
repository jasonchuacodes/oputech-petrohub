'use client'

import { ArrowLeft, CheckCircle2, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '~/components/ui/button'
import { ConfirmationDialog } from '~/components/ui/confirmation-dialog'
import { Spinner } from '~/components/ui/spinner'
import { useActiveTenant } from '../../layout/use-active-tenant'
import { formatBusinessDate, formatShiftTime } from '../create-report-sheet'
import { useDeleteReportMutation, useReportQuery, useSubmitReportMutation } from '../reports.queries'

export function ReportDetailPage({ reportId }: { reportId: string }) {
  const router = useRouter()
  const access = useActiveTenant()
  const reportQuery = useReportQuery(access.tenant.id, reportId)
  const submit = useSubmitReportMutation(access.tenant.id)
  const remove = useDeleteReportMutation(access.tenant.id)
  const [submitOpen, setSubmitOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [error, setError] = useState<string>()
  const canManage = access.role === 'admin' || access.role === 'superadmin'
  const report = reportQuery.data

  if (reportQuery.isPending) return <div className="flex min-h-full items-center justify-center"><Spinner className="size-6" /></div>
  if (reportQuery.isError || !report) return <div className="mx-auto max-w-xl p-6"><p className="text-text-secondary">This report could not be found.</p><Button asChild variant="outline" className="mt-4"><Link href="/report">Back to reports</Link></Button></div>

  const submitReport = async () => {
    try {
      setError(undefined)
      await submit.mutateAsync({ reportId, expectedRevision: report.revision })
      setSubmitOpen(false)
    } catch { setError('Unable to submit this report. Refresh and try again.') }
  }
  const deleteReport = async () => {
    try {
      setError(undefined)
      await remove.mutateAsync({ reportId, expectedRevision: report.revision })
      router.replace('/report')
    } catch { setError('Unable to delete this report. Refresh and try again.') }
  }

  return (
    <div className="mx-auto flex min-h-full w-full max-w-5xl flex-col px-5 py-5 md:p-6">
      <header className="flex min-h-11 items-start gap-2"><Button asChild variant="ghost" size="icon" className="-ml-3"><Link href="/report" aria-label="Back to reports"><ArrowLeft aria-hidden="true" /></Link></Button><h1 className="pt-1 text-page-title font-semibold">Shift report</h1></header>
      <div className="mt-4 flex flex-wrap items-start justify-between gap-3">
        <div><p className="text-sm text-text-secondary">{formatBusinessDate(report.businessDate)}</p><p className="text-lg font-semibold text-text-heading">{formatShiftTime(report.interval)}</p><p className="mt-1 text-sm text-text-tertiary">Created by {report.creatorName} · Saved {new Date(report.updatedAt).toLocaleString()}</p>{report.submittedAt && <p className="text-sm text-text-tertiary">Submitted by {report.submittedByName} · {new Date(report.submittedAt).toLocaleString()}</p>}</div>
        <span className={report.status === 'submitted' ? 'rounded-sm bg-status-success/12 px-2.5 py-1 text-sm font-medium text-status-success' : 'rounded-sm bg-status-warning/12 px-2.5 py-1 text-sm font-medium text-status-warning'}>{report.status === 'submitted' ? 'Submitted' : 'Draft'}</span>
      </div>
      <section className="mt-5 rounded-md bg-card p-5 shadow-card"><h2 className="font-medium text-text-heading">Report entries</h2><p className="mt-1 text-sm text-text-secondary">Entry forms and calculations are not included in this report-creation release.</p></section>
      {error && <p role="alert" className="mt-4 text-sm text-destructive">{error}</p>}
      {canManage && <div className="mt-auto flex flex-col gap-3 pt-6 sm:flex-row sm:justify-end">{report.status === 'draft' && <Button type="button" onClick={() => setSubmitOpen(true)}><CheckCircle2 aria-hidden="true" /> Mark submitted</Button>}<Button type="button" variant="destructive" onClick={() => setDeleteOpen(true)}><Trash2 aria-hidden="true" /> Delete report</Button></div>}
      <ConfirmationDialog open={submitOpen} title="Submit report?" description="This status change cannot be reversed." icon={CheckCircle2} confirmText="Mark submitted" loading={submit.isPending} onClose={() => setSubmitOpen(false)} onConfirm={() => void submitReport()}><p className="text-sm text-text-secondary">This records submission metadata only. It does not apply inventory or financial changes.</p></ConfirmationDialog>
      <ConfirmationDialog open={deleteOpen} title="Delete report?" description="This action cannot be undone." icon={Trash2} variant="danger" confirmText="Delete report" loading={remove.isPending} onClose={() => setDeleteOpen(false)} onConfirm={() => void deleteReport()}><p className="text-sm text-text-secondary">The report will be permanently deleted and its shift slot will become available again.</p></ConfirmationDialog>
    </div>
  )
}
