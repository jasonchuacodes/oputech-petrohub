'use client';

import Link from 'next/link';
import { Button } from '~/components/ui/button';
import { Spinner } from '~/components/ui/spinner';
import { useSessionQuery } from '../../auth/auth.queries';
import { useActiveTenant } from '../../layout/use-active-tenant';
import { useReportQuery } from '../reports.queries';
import { ReportEditor } from './report-editor';

export function ReportDetailPage({ reportId }: { reportId: string }) {
  const access = useActiveTenant();
  const reportQuery = useReportQuery(access.tenant.id, reportId);
  const session = useSessionQuery();

  if (reportQuery.isPending || session.isPending) {
    return (
      <div className="flex min-h-full items-center justify-center">
        <Spinner className="size-6" />
      </div>
    );
  }

  if (reportQuery.isError || !reportQuery.data) {
    return (
      <div className="mx-auto max-w-xl p-6">
        <p className="text-text-secondary">This report could not be found.</p>
        <Button asChild variant="outline" className="mt-4">
          <Link href="/report">Back to reports</Link>
        </Button>
      </div>
    );
  }

  return (
    <ReportEditor
      key={`${access.tenant.id}:${reportQuery.data.id}`}
      report={reportQuery.data}
      tenantId={access.tenant.id}
      userId={session.data?.user.id}
      role={access.role}
    />
  );
}
