'use client';

import { ChevronRight, Plus } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '~/components/ui/button';
import { DateRangePicker } from '~/components/ui/date-range-picker';
import { PageHeader } from '~/components/ui/page-header';
import { Spinner } from '~/components/ui/spinner';
import { useActiveTenant } from '../layout/use-active-tenant';
import type { TenantAccess } from '../tenants/tenants.queries';
import { CreateReportSheet, formatBusinessDate, formatShiftTime } from './create-report-sheet';
import { currentReportMonth } from './report-date-range';
import { useReportsQuery } from './reports.queries';

export function ReportsPage() {
  const access = useActiveTenant();
  return <TenantReportsPage key={access.tenant.id} access={access} />;
}

function TenantReportsPage({ access }: { access: TenantAccess }) {
  const router = useRouter();
  const administrator = access.role === 'admin' || access.role === 'superadmin';
  const [range, setRange] = useState(() => currentReportMonth(access.tenant.timezone));
  const reports = useReportsQuery(
    access.tenant.id,
    administrator ? range.startDate : undefined,
    administrator ? range.endDate : undefined,
  );
  const [creating, setCreating] = useState(false);
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-5 py-5 md:p-6">
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
      <div className="flex flex-col gap-1">
        {administrator && (
          <section aria-label="Report date range" className="flex min-h-12 items-center justify-end">
            <DateRangePicker
              startDate={range.startDate}
              endDate={range.endDate}
              timezone={access.tenant.timezone}
              disabled={reports.isFetching}
              onApply={(startDate, endDate) => setRange({ startDate, endDate })}
            />
          </section>
        )}
        <section className="overflow-hidden rounded-md bg-card shadow-card">
          {reports.isPending && (
            <div className="flex min-h-40 items-center justify-center">
              <Spinner className="size-6" />
            </div>
          )}
          {reports.isError && <p className="p-5 text-sm text-destructive">Unable to load reports.</p>}
          {reports.data?.items.map((report) => (
            <Link
              key={report.id}
              href={`/report/${report.id}`}
              className="flex min-h-20 items-center gap-3 border-b border-border/60 px-4 py-3 last:border-0 hover:bg-surface-hover"
            >
              <span className="min-w-0 flex-1">
                <span className="block font-medium text-text-heading">
                  {formatShiftTime(report.interval)}
                </span>
                <span className="block text-sm text-text-secondary">
                  {formatBusinessDate(report.businessDate)} · {report.creatorName}
                </span>
                <span
                  className={
                    report.status === 'submitted'
                      ? 'text-xs font-medium text-status-success'
                      : report.status === 'revoked'
                        ? 'text-xs font-medium text-status-error'
                      : 'text-xs font-medium text-status-warning'
                  }
                >
                  {report.status === 'submitted' ? 'Submitted' : report.status === 'revoked' ? 'Revoked' : 'Draft'}
                </span>
              </span>
              <ChevronRight aria-hidden="true" className="size-5 text-primary" />
            </Link>
          ))}
          {reports.data?.items.length === 0 && (
            <p className="p-5 text-center text-sm text-text-secondary">
              {administrator ? 'No reports found in this date range.' : 'No reports have been created.'}
            </p>
          )}
        </section>
      </div>
      {creating && (
        <CreateReportSheet
          onClose={() => setCreating(false)}
          onOpenReport={(id) => {
            setCreating(false);
            router.push(`/report/${id}`);
          }}
        />
      )}
    </div>
  );
}
