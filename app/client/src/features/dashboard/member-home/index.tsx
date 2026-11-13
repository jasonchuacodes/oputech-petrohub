'use client'

import { ChevronRight, FilePlus2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'
import { formatShiftTime } from '~/utils/time'
import { CreateReportSheet } from '../../reports/create-report-sheet'
import { useReportCreationContextQuery } from '../../reports/reports.queries'
import { useActiveTenant } from '../../layout/use-active-tenant'
import { AttendanceCard } from './attendance-card'
import { HomeGreeting } from '../home-greeting'

export function MemberHomePage() {
  const router = useRouter()
  const { tenant } = useActiveTenant()
  const reports = useReportCreationContextQuery(tenant.id)
  const [showCreateReport, setShowCreateReport] = useState(false)

  const closeCreateReport = useCallback(() => setShowCreateReport(false), [])
  const openReport = useCallback(
    (reportId: string) => {
      setShowCreateReport(false)
      router.push(`/report/${reportId}`)
    },
    [router],
  )

  return (
    <div className="mx-auto flex min-h-full w-full flex-col gap-5 px-5 py-5 md:max-w-4xl md:p-6 wide:max-w-7xl">
      <HomeGreeting />

      <AttendanceCard tenantId={tenant.id} />

      <section aria-labelledby="actions-heading">
        <h2
          id="actions-heading"
          className="flex min-h-10 items-center font-sans text-sm font-semibold tracking-[0.14em] text-text-heading uppercase"
        >
          Actions
        </h2>
        <button
          type="button"
          className="group flex min-h-24 w-full items-center gap-4 rounded-md bg-card px-5 py-4 text-left shadow-card outline-none transition-colors hover:bg-surface-hover focus-visible:ring-3 focus-visible:ring-ring/30"
          onClick={() => setShowCreateReport(true)}
        >
          <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <FilePlus2 aria-hidden="true" className="size-6" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-semibold text-text-heading">Create report</span>
            <span className="mt-1 block text-sm text-text-secondary">
              Choose a shift and submit your report.
            </span>
          </span>
        </button>
      </section>

      <section aria-labelledby="overview-heading">
        <h2
          id="overview-heading"
          className="flex min-h-10 items-center font-sans text-sm font-semibold tracking-[0.14em] text-text-heading uppercase"
        >
          Reports overview
        </h2>
        <div className="overflow-hidden rounded-md bg-card shadow-card">
          {reports.data?.slots.map(({ id, shift, interval, report }) => (
            <div
              key={id}
              className="border-b border-border/60 px-4 py-3 last:border-b-0"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="shrink-0 font-semibold text-text-heading">
                      {shift.name}
                    </span>
                    <span
                      className={`shrink-0 rounded-sm px-2 py-0.5 text-xs font-medium ${
                        report?.status === 'submitted'
                          ? 'bg-status-success/12 text-status-success'
                          : report
                            ? 'bg-status-warning/12 text-status-warning'
                            : 'bg-muted text-text-secondary'
                      }`}
                    >
                      {report?.stale ? 'Recreate' : report?.status === 'submitted' ? 'Submitted' : report ? 'Draft' : 'Pending'}
                    </span>
                  </div>
                  <p className="mt-1 truncate text-sm text-text-secondary">
                    Report period {formatShiftTime(interval)}
                  </p>
                </div>
                {report && (
                  <Link
                    href={`/report/${report.id}`}
                    aria-label={`View ${formatShiftTime(interval)} report`}
                    className="group flex size-9 items-center justify-center rounded-sm text-primary outline-none hover:bg-primary/10 focus-visible:ring-3 focus-visible:ring-ring/30"
                  >
                    <ChevronRight
                      aria-hidden="true"
                      className="size-5 transition-transform group-hover:translate-x-0.5"
                    />
                  </Link>
                )}
              </div>
            </div>
          ))}
          {reports.isPending && (
            <p className="p-4 text-sm text-text-secondary">Loading report overview…</p>
          )}
          {reports.isError && (
            <p className="p-4 text-sm text-destructive">Unable to load report overview.</p>
          )}
          {reports.data?.slots.length === 0 && (
            <p className="p-4 text-sm text-text-secondary">No shifts configured.</p>
          )}
        </div>
      </section>

      {showCreateReport && (
        <CreateReportSheet onClose={closeCreateReport} onOpenReport={openReport} />
      )}
    </div>
  )
}
