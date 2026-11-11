'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import Decimal from 'decimal.js'
import { ArrowLeft, CheckCircle2, CircleAlert, Plus, Save, Trash2, X } from 'lucide-react'
import Link from 'next/link'
import { useState, type ReactNode } from 'react'
import { useFieldArray, useForm, useWatch, type UseFormRegister } from 'react-hook-form'
import { toast } from 'sonner'
import { Button } from '~/components/ui/button'
import { ConfirmationDialog } from '~/components/ui/confirmation-dialog'
import { Input } from '~/components/ui/input'
import { Spinner } from '~/components/ui/spinner'
import { cn } from '~/utils/cn'
import { useSessionQuery } from '../../auth/auth.queries'
import { useActiveTenant } from '../../layout/use-active-tenant'
import { formatBusinessDate, formatShiftTime } from '../create-report-sheet'
import {
  type ReportDetailRecord,
  useDeleteReportMutation,
  useReportQuery,
  useSaveReportDraftMutation,
  useSubmitReportMutation,
} from '../reports.queries'
import { reportDetailFormSchema, type ReportDetailFormValues } from './report-detail.schema'

export function ReportDetailPage({ reportId }: { reportId: string }) {
  const access = useActiveTenant()
  const reportQuery = useReportQuery(access.tenant.id, reportId)
  const session = useSessionQuery()

  if (reportQuery.isPending || session.isPending) return <div className="flex min-h-full items-center justify-center"><Spinner className="size-6" /></div>
  if (reportQuery.isError || !reportQuery.data) return <div className="mx-auto max-w-xl p-6"><p className="text-text-secondary">This report could not be found.</p><Button asChild variant="outline" className="mt-4"><Link href="/report">Back to reports</Link></Button></div>

  return <ReportEditor key={`${access.tenant.id}:${reportQuery.data.id}`} report={reportQuery.data} tenantId={access.tenant.id} userId={session.data?.user.id} role={access.role} />
}

function ReportEditor({ report, tenantId, userId, role }: { report: ReportDetailRecord; tenantId: string; userId?: string; role: 'member' | 'admin' | 'superadmin' }) {
  const saveReport = useSaveReportDraftMutation(tenantId)
  const submitReport = useSubmitReportMutation(tenantId)
  const deleteReport = useDeleteReportMutation(tenantId)
  const [tab, setTab] = useState<'detail' | 'disposals'>('detail')
  const [submitOpen, setSubmitOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteReason, setDeleteReason] = useState('')
  const [actionError, setActionError] = useState<string>()
  const administrator = role === 'admin' || role === 'superadmin'
  const canEdit = report.status === 'draft' && !report.legacy && (administrator || report.creatorId === userId)
  const canDelete = administrator && report.status !== 'revoked' && !report.legacy && !report.disposals?.successorBatchId
  const defaults = toFormValues(report)
  const form = useForm<ReportDetailFormValues>({ resolver: zodResolver(reportDetailFormSchema), defaultValues: defaults, mode: 'onChange' })
  const income = useFieldArray({ control: form.control, name: 'incomeEntries', keyName: 'fieldKey' })
  const expenses = useFieldArray({ control: form.control, name: 'expenseEntries', keyName: 'fieldKey' })
  const values = useWatch({ control: form.control })
  const preview = calculatePreview(report, values)
  const pending = saveReport.isPending || submitReport.isPending || deleteReport.isPending

  const save = form.handleSubmit(async (formValues) => {
    setActionError(undefined)
    try {
      const updated = await saveReport.mutateAsync(toSaveInput(report, formValues))
      form.reset(toFormValues(updated))
      toast.success('Draft saved')
      return updated
    } catch {
      setActionError('Unable to save. The report may have changed; reload before trying again.')
      return undefined
    }
  })

  const submit = async () => {
    setActionError(undefined)
    try {
      let current = report
      if (form.formState.isDirty) {
        const valid = await form.trigger()
        if (!valid) { setSubmitOpen(false); return }
        current = await saveReport.mutateAsync(toSaveInput(report, form.getValues()))
        form.reset(toFormValues(current))
      }
      if (!current.disposals?.complete) {
        setSubmitOpen(false)
        setTab('disposals')
        setActionError('Complete every closing reading before submitting.')
        return
      }
      await submitReport.mutateAsync({ reportId: current.id, expectedReportRevision: current.revision, expectedDisposalRevision: current.disposals.revision })
      setSubmitOpen(false)
      toast.success('Report submitted')
    } catch {
      setActionError('Unable to submit. Refresh and review the latest report values.')
    }
  }

  const remove = async () => {
    if (!report.disposals || deleteReason.trim().length < 3) return
    setActionError(undefined)
    try {
      await deleteReport.mutateAsync({
        reportId: report.id,
        expectedReportRevision: report.revision,
        expectedDisposalRevision: report.disposals.revision,
        reason: deleteReason.trim(),
      })
      setDeleteOpen(false)
      toast.success('Report deleted and readings rolled back')
    } catch {
      setActionError('Unable to delete this report. A later report may already depend on its readings.')
      setDeleteOpen(false)
    }
  }

  return (
    <form className="mx-auto flex min-h-full w-full max-w-4xl flex-col px-5 py-5 md:p-6" onSubmit={(event) => event.preventDefault()}>
      <header className="flex min-h-11 items-start gap-2">
        <Button asChild variant="ghost" size="icon" className="-ml-3"><Link href="/report" aria-label="Back to reports"><ArrowLeft aria-hidden="true" /></Link></Button>
        <div className="min-w-0 flex-1"><h1 className="pt-1 text-page-title font-semibold">Shift report</h1><p className="mt-1 text-sm text-text-secondary">{formatBusinessDate(report.businessDate)} · {formatShiftTime(report.interval)}</p></div>
        <StatusBadge status={report.status} />
      </header>

      {report.status === 'revoked' && <div className="mt-4 rounded-md bg-status-error/10 p-4"><p className="font-medium text-status-error">This report was revoked</p><p className="mt-1 text-sm text-text-secondary">{report.revocationReason}</p><p className="mt-1 text-xs text-text-tertiary">Deleted by {report.revokedByName} {report.revokedAt ? `· ${new Date(report.revokedAt).toLocaleString()}` : ''}</p></div>}
      {!canEdit && report.status === 'draft' && <div className="mt-4 flex gap-2 rounded-md bg-status-warning/10 p-3 text-sm text-text-secondary"><CircleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-status-warning" />This draft is being prepared by {report.creatorName}. Only its creator or an administrator can edit it.</div>}
      {report.legacy && <div className="mt-4 rounded-md bg-muted p-3 text-sm text-text-secondary">This legacy report has no disposal entries and is available for historical reference only.</div>}

      <div role="tablist" aria-label="Report sections" className="mt-5 flex rounded-md bg-muted p-1">
        <button type="button" role="tab" aria-selected={tab === 'detail'} className={cn('min-h-11 flex-1 rounded-sm px-3 text-sm font-medium', tab === 'detail' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-text-secondary')} onClick={() => setTab('detail')}>Report detail</button>
        <button type="button" role="tab" aria-selected={tab === 'disposals'} className={cn('min-h-11 flex-1 rounded-sm px-3 text-sm font-medium', tab === 'disposals' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-text-secondary')} onClick={() => setTab('disposals')}>Disposal readings</button>
      </div>

      {tab === 'detail' ? (
        <div role="tabpanel" className="mt-5 flex flex-col gap-5">
          <SummaryCard preview={preview} />
          <p className="text-sm text-text-tertiary">Created by {report.creatorName} · Last saved {new Date(report.updatedAt).toLocaleString()}{report.submittedAt ? ` · Submitted by ${report.submittedByName}` : ''}</p>
          <FinancialSection title="Income" fields={income.fields} prefix="incomeEntries" register={form.register} descriptionError={(index) => form.formState.errors.incomeEntries?.[index]?.description?.message} amountError={(index) => form.formState.errors.incomeEntries?.[index]?.amount?.message} canEdit={canEdit} onAdd={() => income.append({ id: crypto.randomUUID(), description: '', notes: '', amount: '' })} onRemove={income.remove} total={preview.income} />
          <FinancialSection title="Expense" fields={expenses.fields} prefix="expenseEntries" register={form.register} descriptionError={(index) => form.formState.errors.expenseEntries?.[index]?.description?.message} amountError={(index) => form.formState.errors.expenseEntries?.[index]?.amount?.message} canEdit={canEdit} onAdd={() => expenses.append({ id: crypto.randomUUID(), description: '', notes: '', amount: '' })} onRemove={expenses.remove} total={preview.expenses} />
        </div>
      ) : (
        <div role="tabpanel" className="mt-5 flex flex-col gap-3">
          {report.disposals?.readings.map((reading, index) => {
            const calculated = preview.readings[index]
            return <section key={reading.meterId} className="rounded-md bg-card p-4 shadow-card"><div className="mb-3"><h2 className="font-medium text-text-heading">{reading.meterLabel}</h2><p className="text-sm text-text-tertiary">{reading.productName}</p></div><div className="divide-y divide-border/60"><ReadingRow label="Closing reading"><Input className="max-w-44 text-right tabular-nums" inputMode="decimal" placeholder="Enter reading" disabled={!canEdit} aria-invalid={Boolean(form.formState.errors.disposalReadings?.[index]?.closingReading)} {...form.register(`disposalReadings.${index}.closingReading`)} /></ReadingRow><ReadingRow label="Opening reading"><span className="tabular-nums">{formatReading(reading.openingReading)}</span></ReadingRow><p className="-mt-2 pb-3 text-right text-xs text-text-tertiary">{reading.openingSource === 'previous_report' ? 'Previous submitted report' : 'Initial configured reading'}</p><ReadingRow label="Calibration"><Input className="max-w-44 text-right tabular-nums" inputMode="decimal" disabled={!canEdit} {...form.register(`disposalReadings.${index}.calibration`)} /></ReadingRow><ReadingRow label="Net disposal"><span className="tabular-nums">{calculated?.net ?? '—'}</span></ReadingRow><ReadingRow label="Unit price"><span className="tabular-nums">{formatMoney(reading.unitPrice)}</span></ReadingRow><ReadingRow label="Sales" strong><span className="tabular-nums">{calculated?.sales ? formatMoney(calculated.sales) : '—'}</span></ReadingRow></div></section>
          })}
          {!report.disposals && <div className="rounded-md bg-card p-5 text-sm text-text-secondary shadow-card">No disposal readings are available.</div>}
        </div>
      )}

      {actionError && <p role="alert" className="mt-4 text-sm text-destructive">{actionError}</p>}
      {(canEdit || canDelete) && <footer className="sticky bottom-0 mt-auto flex flex-wrap gap-3 border-t border-border bg-background/95 pt-4 pb-[calc(1rem+env(safe-area-inset-bottom))] backdrop-blur"><div className="flex flex-1 gap-3">{canEdit && <><Button type="button" variant="outline" className="flex-1" disabled={pending || !form.formState.isDirty} onClick={() => void save()}><Save aria-hidden="true" />{saveReport.isPending ? 'Saving…' : 'Save draft'}</Button><Button type="button" className="flex-1" disabled={pending || !form.formState.isValid} onClick={() => setSubmitOpen(true)}><CheckCircle2 aria-hidden="true" />Review and submit</Button></>}{canDelete && <Button type="button" variant="destructive" className={cn(!canEdit && 'ml-auto')} disabled={pending} onClick={() => setDeleteOpen(true)}><Trash2 aria-hidden="true" />Delete report</Button>}</div></footer>}

      <ConfirmationDialog open={submitOpen} title="Submit report?" description="Review the summary and disposal readings before submitting." icon={CheckCircle2} confirmText="Submit report" loading={submitReport.isPending || saveReport.isPending} onClose={() => setSubmitOpen(false)} onConfirm={() => void submit()}><SummaryCard preview={preview} compact />{!preview.complete && <p className="mt-3 text-sm text-destructive">Complete every disposal reading before submitting.</p>}</ConfirmationDialog>
      <ConfirmationDialog open={deleteOpen} title="Delete report?" description="The report will be marked revoked. Submitted pump readings will roll back to their openings." icon={Trash2} variant="danger" confirmText="Delete report" disabled={deleteReason.trim().length < 3} loading={deleteReport.isPending} onClose={() => setDeleteOpen(false)} onConfirm={() => void remove()}><label className="flex flex-col gap-1.5"><span className="text-sm font-medium">Reason</span><Input value={deleteReason} maxLength={240} placeholder="Why is this report being deleted?" onChange={(event) => setDeleteReason(event.target.value)} /></label></ConfirmationDialog>
    </form>
  )
}

type EntryField = { id: string; fieldKey: string; description: string; notes: string; amount: string }

function FinancialSection({ title, fields, prefix, register, descriptionError, amountError, canEdit, onAdd, onRemove, total }: { title: string; fields: EntryField[]; prefix: 'incomeEntries' | 'expenseEntries'; register: UseFormRegister<ReportDetailFormValues>; descriptionError: (index: number) => string | undefined; amountError: (index: number) => string | undefined; canEdit: boolean; onAdd: () => void; onRemove: (index: number) => void; total: string }) {
  return <section><div className="flex min-h-10 items-center justify-between"><h2 className="text-card-title font-medium text-text-heading">{title}</h2></div><div className="overflow-hidden rounded-md bg-card px-4 shadow-card">{fields.map((field, index) => { const descriptionMessage = descriptionError(index); const amountMessage = amountError(index); return <div key={field.fieldKey} className="grid grid-cols-[1fr_minmax(8rem,11rem)_2.75rem] items-start gap-3 border-b border-border/60 py-3"><div><Input aria-label={`${title} description`} placeholder="Description" disabled={!canEdit} aria-invalid={Boolean(descriptionMessage)} {...register(`${prefix}.${index}.description`)} />{descriptionMessage && <p className="mt-1 text-xs text-destructive">{descriptionMessage}</p>}</div><div><Input aria-label={`${title} amount`} inputMode="decimal" placeholder="0.00" className="text-right tabular-nums" disabled={!canEdit} aria-invalid={Boolean(amountMessage)} {...register(`${prefix}.${index}.amount`)} />{amountMessage && <p className="mt-1 text-xs text-destructive">{amountMessage}</p>}</div>{canEdit ? <Button type="button" size="icon" variant="ghost" aria-label={`Remove ${title.toLowerCase()}`} onClick={() => onRemove(index)}><X aria-hidden="true" /></Button> : <span />}</div> })}{fields.length === 0 && <p className="py-4 text-sm text-text-tertiary">No {title.toLowerCase()} entries.</p>}{canEdit && <button type="button" className="flex min-h-12 w-full items-center gap-2 border-b border-border/60 text-sm font-medium text-primary" onClick={onAdd}><Plus aria-hidden="true" className="size-4" />Add {title.toLowerCase()}</button>}<div className="flex min-h-14 items-center justify-between font-medium"><span>Total {title.toLowerCase()}</span><span className="tabular-nums">{formatMoney(total)}</span></div></div></section>
}

function SummaryCard({ preview, compact = false }: { preview: Preview; compact?: boolean }) {
  const difference = new Decimal(preview.overShort ?? 0)
  const label = difference.isZero() ? 'Balanced' : difference.isPositive() ? 'Over' : 'Short'
  return <section className={cn('rounded-md bg-card shadow-card', compact ? 'p-3' : 'p-4')}><h2 className="font-medium text-text-heading">Report summary</h2><div className="mt-3 divide-y divide-border/60"><SummaryRow label="Income" value={formatMoney(preview.income)} /><SummaryRow label="Expenses" value={formatMoney(preview.expenses)} /><SummaryRow label="Cash fuel sales" value={formatMoney(preview.cashFuelSales)} strong /><div className="my-2" /><SummaryRow label="Pump sales" value={preview.pumpSales ? formatMoney(preview.pumpSales) : 'Incomplete'} /><SummaryRow label={preview.pumpSales ? label : 'Over / Short'} value={preview.overShort ? formatMoney(difference.abs().toFixed(2)) : '—'} strong /></div></section>
}

function SummaryRow({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) { return <div className={cn('flex min-h-10 items-center justify-between gap-4', strong && 'font-semibold')}><span>{label}</span><span className="tabular-nums">{value}</span></div> }
function ReadingRow({ label, children, strong = false }: { label: string; children: ReactNode; strong?: boolean }) { return <div className={cn('flex min-h-14 items-center justify-between gap-4 py-2', strong && 'font-semibold')}><span className="text-text-secondary">{label}</span>{children}</div> }
function StatusBadge({ status }: { status: ReportDetailRecord['status'] }) { const label = status === 'submitted' ? 'Submitted' : status === 'revoked' ? 'Revoked' : 'Draft'; return <span className={cn('mt-1 rounded-sm px-2.5 py-1 text-xs font-medium', status === 'submitted' ? 'bg-status-success/12 text-status-success' : status === 'revoked' ? 'bg-status-error/12 text-status-error' : 'bg-status-warning/12 text-status-warning')}>{label}</span> }

function toFormValues(report: ReportDetailRecord): ReportDetailFormValues {
  return {
    incomeEntries: report.incomeEntries.map((entry) => ({ ...entry, notes: entry.notes ?? '' })),
    expenseEntries: report.expenseEntries.map((entry) => ({ ...entry, notes: entry.notes ?? '' })),
    disposalReadings: report.disposals?.readings.map((reading) => ({ meterId: reading.meterId, closingReading: reading.closingReading ?? '', calibration: reading.calibration })) ?? [],
  }
}

function toSaveInput(report: ReportDetailRecord, values: ReportDetailFormValues) {
  if (!report.disposals) throw new Error('Disposal readings are unavailable')
  return {
    reportId: report.id,
    expectedReportRevision: report.revision,
    expectedDisposalRevision: report.disposals.revision,
    incomeEntries: values.incomeEntries.map((entry) => ({ ...entry, notes: entry.notes || null })),
    expenseEntries: values.expenseEntries.map((entry) => ({ ...entry, notes: entry.notes || null })),
    disposalReadings: values.disposalReadings.map((reading) => ({ ...reading, closingReading: reading.closingReading || null })),
  }
}

type Preview = { income: string; expenses: string; cashFuelSales: string; pumpSales?: string; overShort?: string; complete: boolean; readings: Array<{ net?: string; sales?: string }> }

type PreviewValues = {
  incomeEntries?: Array<{ amount?: string }>
  expenseEntries?: Array<{ amount?: string }>
  disposalReadings?: Array<{ closingReading?: string; calibration?: string }>
}

function calculatePreview(report: ReportDetailRecord, values: PreviewValues): Preview {
  const income = addAmounts(values.incomeEntries)
  const expenses = addAmounts(values.expenseEntries)
  const cashFuelSales = income.minus(expenses)
  let complete = Boolean(report.disposals?.readings.length)
  const readings = (report.disposals?.readings ?? []).map((reading, index) => {
    try {
      const value = values.disposalReadings?.[index]
      if (!value?.closingReading) { complete = false; return {} }
      const gross = new Decimal(value.closingReading).minus(reading.openingReading)
      const net = gross.minus(value.calibration || 0)
      if (gross.isNegative() || net.isNegative()) { complete = false; return {} }
      return { net: net.toFixed(3), sales: net.times(reading.unitPrice).toDecimalPlaces(2, Decimal.ROUND_HALF_UP).toFixed(2) }
    } catch { complete = false; return {} }
  })
  const pumpSales = complete ? readings.reduce((total, reading) => total.plus(reading.sales ?? 0), new Decimal(0)) : undefined
  return { income: income.toFixed(2), expenses: expenses.toFixed(2), cashFuelSales: cashFuelSales.toFixed(2), pumpSales: pumpSales?.toFixed(2), overShort: pumpSales ? cashFuelSales.minus(pumpSales).toFixed(2) : undefined, complete, readings }
}

function addAmounts(entries?: Array<{ amount?: string }>) { return (entries ?? []).reduce((total, entry) => { try { return entry.amount ? total.plus(entry.amount) : total } catch { return total } }, new Decimal(0)) }
function formatMoney(value: string) { const [whole, fraction = '00'] = new Decimal(value).toFixed(2).split('.'); return `₱${whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}.${fraction}` }
function formatReading(value: string) { return new Decimal(value).toFixed(3) }
