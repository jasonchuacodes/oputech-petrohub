'use client';

import { CircleAlert, MoreVertical } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { PageHeader } from '~/components/ui/page-header';
import { PageIntro } from '~/components/ui/page-intro';
import { cn } from '~/utils/cn';
import { formatBusinessDate, formatShiftTime } from '../create-report-sheet';
import type { ReportDetailRecord } from '../reports.queries';
import { ReportDisposalsPanel } from './report-disposals';
import { ReportDetailsPanel } from './report-details';
import { ReportLubricantsPanel } from './report-lubricants';
import { LubricantSaleSheet } from './lubricant-sale-sheet';
import { ReportEditorDialogs, ReportEditorFooter } from './report-editor-actions';
import { ReportEditorProvider, useReportEditor } from './report-editor-context';

type ReportEditorProps = {
  report: ReportDetailRecord;
  tenantId: string;
  userId?: string;
  role: 'member' | 'admin' | 'superadmin';
};

export function ReportEditor(props: ReportEditorProps) {
  return (
    <ReportEditorProvider {...props}>
      <ReportEditorLayout />
    </ReportEditorProvider>
  );
}

function ReportEditorLayout() {
  const { report, tab, setTab, actionError, canDelete, pending, reportActions, lubricantSaleEditor } =
    useReportEditor();

  return (
    <form
      className="mx-auto flex min-h-full w-full max-w-4xl flex-col px-5 py-5 md:p-6"
      onSubmit={(event) => event.preventDefault()}
    >
      <PageHeader
        title="Shift report"
        backHref="/report"
        backLabel="Back to reports"
        action={
          canDelete ? (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Report actions"
              title="Report actions"
              disabled={pending}
              onClick={reportActions.onOpen}
            >
              <MoreVertical aria-hidden="true" className="size-5" />
            </Button>
          ) : undefined
        }
      />

      <div className="mt-5">
        <PageIntro>
          Review the report details for:
          <span className="mt-1 block font-medium text-status-warning">
            {formatBusinessDate(report.businessDate)} · {formatShiftTime(report.interval)}.
          </span>
        </PageIntro>
      </div>

      <ReportNotices />

      <div
        role="tablist"
        aria-label="Report sections"
        className="mt-5 flex rounded-md bg-muted p-1"
      >
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'detail'}
          className={cn(
            'min-h-11 flex-1 rounded-sm px-3 text-sm font-medium',
            tab === 'detail'
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-text-secondary',
          )}
          onClick={() => setTab('detail')}
        >
          Details
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'lubricants'}
          className={cn(
            'min-h-11 flex-1 rounded-sm px-3 text-sm font-medium',
            tab === 'lubricants'
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-text-secondary',
          )}
          onClick={() => setTab('lubricants')}
        >
          Lubes
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'disposals'}
          className={cn(
            'min-h-11 flex-1 rounded-sm px-3 text-sm font-medium',
            tab === 'disposals'
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-text-secondary',
          )}
          onClick={() => setTab('disposals')}
        >
          Disposals
        </button>
      </div>

      <div className="flex flex-1 flex-col">
        {tab === 'detail' ? <ReportDetailsPanel /> : tab === 'lubricants' ? <ReportLubricantsPanel /> : <ReportDisposalsPanel />}

        {actionError && (
          <p role="alert" className="mt-4 text-sm text-destructive">
            {actionError}
          </p>
        )}
      </div>
      <ReportEditorFooter />
      <ReportEditorDialogs />
      {lubricantSaleEditor.open && <LubricantSaleSheet />}
    </form>
  );
}

function ReportNotices() {
  const { report, canEdit } = useReportEditor();

  return (
    <>
      {report.status === 'revoked' && (
        <div className="mt-4 rounded-md bg-status-error/10 p-4">
          <p className="font-medium text-status-error">This report was revoked</p>
          <p className="mt-1 text-sm text-text-secondary">{report.revocationReason}</p>
          <p className="mt-1 text-xs text-text-tertiary">
            Deleted by {report.revokedByName}{' '}
            {report.revokedAt ? `· ${new Date(report.revokedAt).toLocaleString()}` : ''}
          </p>
        </div>
      )}
      {!canEdit && report.status === 'draft' && (
        <div className="mt-4 flex gap-2 rounded-md bg-status-warning/10 p-3 text-sm text-text-secondary">
          <CircleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-status-warning" />
          This draft is being prepared by {report.creatorName}. Only its creator or an administrator
          can edit it.
        </div>
      )}
      {report.legacy && (
        <div className="mt-4 rounded-md bg-muted p-3 text-sm text-text-secondary">
          This legacy report has no disposal entries and is available for historical reference only.
        </div>
      )}
    </>
  );
}
