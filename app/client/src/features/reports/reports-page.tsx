'use client'

import { ChevronRight, Eye, MoreVertical, Plus, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '~/components/ui/button'
import { ConfirmationDialog } from '~/components/ui/confirmation-dialog'
import { DataTable, type DataTableColumn } from '~/components/ui/data-table'
import { DateRangePicker } from '~/components/ui/date-range-picker'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { Input } from '~/components/ui/input'
import { PageHeader } from '~/components/ui/page-header'
import { Spinner } from '~/components/ui/spinner'
import type { ReportsQuery } from '~/generated/graphql'
import { cn } from '~/utils/cn'
import { formatShiftTime } from '~/utils/time'
import { useSessionQuery } from '../auth/auth.queries'
import { useActiveTenant } from '../layout/use-active-tenant'
import type { TenantAccess } from '../tenants/tenants.queries'
import { CreateReportSheet } from './create-report-sheet'
import { currentReportMonth } from './report-date-range'
import { formatMoney } from './report-detail/utils'
import {
  useDeleteReportMutation,
  useReportQuery,
  useReportsQuery,
} from './reports.queries'

type ReportListItem = ReportsQuery['reports']['items'][number]

export function ReportsPage() {
  const access = useActiveTenant()
  return <TenantReportsPage key={access.tenant.id} access={access} />
}

function TenantReportsPage({ access }: { access: TenantAccess }) {
  const router = useRouter()
  const session = useSessionQuery()
  const administrator = access.role === 'admin' || access.role === 'superadmin'
  const [range, setRange] = useState(() => currentReportMonth(access.tenant.timezone))
  const [creating, setCreating] = useState(false)
  const [deletingReportId, setDeletingReportId] = useState<string>()
  const reports = useReportsQuery(
    access.tenant.id,
    {
      startDate: administrator ? range.startDate : undefined,
      endDate: administrator ? range.endDate : undefined,
      offset: 0,
      limit: 100,
    },
  )
  const items = reports.data?.items ?? []
  const userId = session.data?.user.id
  const columns: DataTableColumn<ReportListItem>[] = [
    {
      id: 'businessDate',
      heading: 'Date',
      width: 150,
      cell: (report) => <span className="font-medium text-text-heading">{report.businessDate}</span>,
    },
    {
      id: 'shiftName',
      heading: 'Shift',
      cell: (report) => report.shiftName,
    },
    {
      id: 'cashSales',
      heading: 'Cash sales',
      align: 'right',
      cell: (report) => <Money value={report.totals.cashFuelSales} />,
    },
    {
      id: 'lubes',
      heading: 'Lubes',
      align: 'right',
      cell: (report) => <Money value={report.totals.lubricantSales} />,
    },
    {
      id: 'pumpSales',
      heading: 'Pump sales',
      align: 'right',
      cell: (report) => <Money value={report.totals.pumpSales} />,
    },
    {
      id: 'status',
      heading: 'Status',
      cell: (report) => <ReportStatusPill status={report.status} />,
    },
    {
      id: 'actions',
      heading: '',
      align: 'right',
      width: 64,
      cell: (report) => (
        <ReportRowActions
          report={report}
          role={access.role}
          userId={userId}
          onView={() => router.push(`/report/${report.id}`)}
          onDelete={() => setDeletingReportId(report.id)}
        />
      ),
    },
  ]

  return (
    <div className="mx-auto flex w-full flex-col gap-5 px-5 py-5 md:max-w-4xl md:p-6 wide:max-w-7xl">
      <PageHeader
        title="Reports"
        description={`Review ${access.tenant.name} shift reports.`}
        action={
          access.role === 'member' ? (
            <Button type="button" onClick={() => setCreating(true)}>
              <Plus aria-hidden="true" /> Create report
            </Button>
          ) : undefined
        }
      />
      <div className="flex flex-col gap-2">
        {administrator && (
          <section
            aria-label="Report date range"
            className="flex min-h-12 items-center justify-end"
          >
            <DateRangePicker
              startDate={range.startDate}
              endDate={range.endDate}
              timezone={access.tenant.timezone}
              disabled={reports.isFetching}
              onApply={(startDate, endDate) => setRange({ startDate, endDate })}
            />
          </section>
        )}

        {reports.isPending && (
          <div className="flex min-h-40 items-center justify-center rounded-md bg-card shadow-card">
            <Spinner className="size-6" />
          </div>
        )}
        {reports.isError && (
          <p className="rounded-md bg-card p-5 text-sm text-destructive shadow-card">
            Unable to load reports.
          </p>
        )}
        {items.length > 0 && (
          <>
            <section
              aria-label="Report cards"
              className="overflow-hidden rounded-md bg-card shadow-card md:hidden"
            >
              {items.map((report) => (
                <Link
                  key={report.id}
                  href={`/report/${report.id}`}
                  className="block min-h-24 border-b border-border/60 px-4 py-3 last:border-0 hover:bg-surface-hover"
                >
                  <span className="block font-medium text-text-heading">
                    {formatReportCardDate(report.businessDate)}
                  </span>
                  <span className="mt-1 flex items-center gap-3 text-sm text-text-secondary">
                    <span className="min-w-0 flex-1 truncate">
                      {report.shiftName} - {formatShiftTime(report.interval)}
                    </span>
                    <ChevronRight aria-hidden="true" className="size-5 shrink-0 text-primary" />
                  </span>
                  <span className="mt-2 block">
                    <ReportStatusPill status={report.status} />
                  </span>
                </Link>
              ))}
            </section>
            <section
              aria-label="Report table"
              className="hidden md:block"
            >
              <DataTable
                collection={DataTable.collection({
                  items,
                  itemToValue: (report) => report.id,
                  itemToString: (report) =>
                    `${report.businessDate}, ${formatShiftTime(report.interval)} report`,
                })}
                columns={columns}
              />
            </section>
          </>
        )}
        {reports.data && items.length === 0 && (
          <p className="rounded-md bg-card p-5 text-center text-sm text-text-secondary shadow-card">
            {administrator ? 'No reports found in this date range.' : 'No reports have been created.'}
          </p>
        )}
      </div>
      {creating && (
        <CreateReportSheet
          onClose={() => setCreating(false)}
          onOpenReport={(id) => {
            setCreating(false)
            router.push(`/report/${id}`)
          }}
        />
      )}
      {deletingReportId && userId && (
        <ReportDeleteDialog
          tenantId={access.tenant.id}
          reportId={deletingReportId}
          role={access.role}
          userId={userId}
          onClose={() => setDeletingReportId(undefined)}
        />
      )}
    </div>
  )
}

function ReportRowActions({
  report,
  role,
  userId,
  onView,
  onDelete,
}: {
  report: ReportListItem
  role: TenantAccess['role']
  userId?: string
  onView: () => void
  onDelete: () => void
}) {
  const canRequestDelete =
    report.status !== 'revoked' &&
    (role === 'admin' || role === 'superadmin' || report.creatorId === userId)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={`Actions for ${report.businessDate} report`}
        className="inline-flex size-9 items-center justify-center rounded-sm text-text-secondary outline-none hover:bg-surface-hover focus-visible:ring-3 focus-visible:ring-ring/30"
      >
        <MoreVertical aria-hidden="true" className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onSelect={onView}>
          <Eye aria-hidden="true" /> View
        </DropdownMenuItem>
        <DropdownMenuItem
          variant="destructive"
          disabled={!canRequestDelete}
          onSelect={onDelete}
        >
          <Trash2 aria-hidden="true" /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function ReportDeleteDialog({
  tenantId,
  reportId,
  role,
  userId,
  onClose,
}: {
  tenantId: string
  reportId: string
  role: TenantAccess['role']
  userId: string
  onClose: () => void
}) {
  const report = useReportQuery(tenantId, reportId)
  const deleteReport = useDeleteReportMutation(tenantId)
  const [reason, setReason] = useState('')
  const [error, setError] = useState<string>()
  const administrator = role === 'admin' || role === 'superadmin'
  const canDelete = Boolean(
    report.data &&
      (administrator || report.data.creatorId === userId) &&
      report.data.status !== 'revoked' &&
      !report.data.legacy &&
      report.data.disposals &&
      !report.data.disposals.successorBatchId,
  )

  const remove = async () => {
    if (!canDelete || !report.data?.disposals || reason.trim().length < 3) return
    setError(undefined)
    try {
      await deleteReport.mutateAsync({
        reportId: report.data.id,
        expectedReportRevision: report.data.revision,
        expectedDisposalRevision: report.data.disposals.revision,
        reason: reason.trim(),
      })
      toast.success('Report deleted and report effects rolled back')
      onClose()
    } catch {
      setError('Unable to delete this report. A later report may depend on its readings.')
    }
  }

  return (
    <ConfirmationDialog
      open
      title="Delete report?"
      description="The report will be marked revoked. Submitted pump readings and lubricant stock movements will be rolled back."
      icon={Trash2}
      variant="danger"
      confirmText="Delete report"
      disabled={!canDelete || reason.trim().length < 3}
      loading={deleteReport.isPending}
      onClose={onClose}
      onConfirm={() => void remove()}
    >
      {report.isPending ? (
        <div className="flex min-h-24 items-center justify-center">
          <Spinner className="size-5" />
        </div>
      ) : report.isError ? (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          Unable to verify this report. Close this dialog and try again.
        </div>
      ) : !canDelete ? (
        <div className="rounded-md bg-muted p-3 text-sm text-text-secondary">
          This report cannot be deleted because it is revoked, legacy, or has a later report that
          depends on it.
        </div>
      ) : (
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium">Reason</span>
          <Input
            value={reason}
            maxLength={240}
            placeholder="Why is this report being deleted?"
            onChange={(event) => setReason(event.target.value)}
          />
        </label>
      )}
      {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
    </ConfirmationDialog>
  )
}

function Money({ value }: { value?: string | null }) {
  return <span className="tabular-nums">{value === null || value === undefined ? '—' : formatMoney(value)}</span>
}

function formatReportCardDate(value: string): string {
  const [year, month, day] = value.split('-').map(Number)
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(year, month - 1, day))
}

function ReportStatusPill({ status }: { status: ReportListItem['status'] }) {
  const label = status === 'submitted' ? 'Submitted' : status === 'revoked' ? 'Revoked' : 'Draft'

  return (
    <span
      className={cn(
        'inline-flex rounded-full px-2.5 py-1 text-xs font-medium',
        status === 'submitted'
          ? 'bg-status-success/12 text-status-success'
          : status === 'revoked'
            ? 'bg-status-error/12 text-status-error'
            : 'bg-status-warning/12 text-status-warning',
      )}
    >
      {label}
    </span>
  )
}
