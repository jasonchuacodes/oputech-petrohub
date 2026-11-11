'use client';

import { ChevronRight, Plus } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '~/components/ui/button';
import { PageHeader } from '~/components/ui/page-header';
import { Spinner } from '~/components/ui/spinner';
import { useActiveTenant } from '../layout/use-active-tenant';
import { CreateReportSheet, formatBusinessDate, formatShiftTime } from './create-report-sheet';
import { useReportsQuery } from './reports.queries';

export function ReportsPage() {
  const access = useActiveTenant();
  const router = useRouter();
  const reports = useReportsQuery(access.tenant.id);
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
            No reports have been created.
          </p>
        )}
      </section>
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
