'use client';

import { CheckCircle2, LoaderCircle, Trash2 } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { ConfirmationDialog } from '~/components/ui/confirmation-dialog';
import { Input } from '~/components/ui/input';
import { Sheet } from '~/components/ui/sheet';
import { formatBusinessDate, formatShiftTime } from '../create-report-sheet';
import { SummaryCard } from './report-details';
import { useReportEditor } from './report-editor-context';

export function ReportEditorFooter() {
  const {
    canEdit,
    report,
    pending,
    isValid,
    saveReportPending,
    submitConfirmation,
  } = useReportEditor();

  if (!canEdit) return null;

  return (
    <footer className="sticky bottom-0 z-20 -mx-5 mt-auto flex shrink-0 flex-wrap gap-3 bg-background px-5 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-[0_-6px_16px_rgba(16,16,16,0.08)] md:-mx-6 md:px-6">
      <Button
        type="button"
        size="lg"
        className="flex-1 rounded-md shadow-[0_4px_14px_rgba(16,16,16,0.14)]"
        disabled={pending || !isValid || report.stale}
        onClick={submitConfirmation.onOpen}
      >
        {saveReportPending ? (
          <LoaderCircle aria-hidden="true" className="size-4 motion-safe:animate-spin" />
        ) : (
          <CheckCircle2 aria-hidden="true" />
        )}
        Review and submit
      </Button>
      <span role="status" aria-live="polite" className="sr-only">
        {saveReportPending ? 'Saving draft' : ''}
      </span>
    </footer>
  );
}

export function ReportEditorDialogs() {
  const {
    preview,
    report,
    reportActions,
    submitConfirmation,
    deleteConfirmation,
    submitReportPending,
    deleteReportPending,
    submit,
    remove,
    deleteReason,
    setDeleteReason,
  } = useReportEditor();

  return (
    <>
      <Sheet
        open={reportActions.open}
        title="Report actions"
        description={`${report.shiftName} · ${formatBusinessDate(report.businessDate)} · ${formatShiftTime(report.interval)}`}
        manageFocus
        onClose={reportActions.onClose}
      >
        <div className="px-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
          <Button
            type="button"
            variant="destructive"
            className="w-full"
            disabled={deleteReportPending}
            onClick={() => {
              reportActions.onClose();
              deleteConfirmation.onOpen();
            }}
          >
            <Trash2 aria-hidden="true" />
            Delete report
          </Button>
        </div>
      </Sheet>
      <ConfirmationDialog
        open={submitConfirmation.open}
        title="Submit report summary?"
        description={`${report.shiftName} · ${formatBusinessDate(report.businessDate)} · ${formatShiftTime(report.interval)}`}
        icon={CheckCircle2}
        confirmText="Submit report"
        disabled={!preview.complete}
        loading={submitReportPending}
        onClose={submitConfirmation.onClose}
        onConfirm={() => void submit()}
      >
        <SummaryCard compact />
        {!preview.complete && (
          <p className="mt-3 text-sm text-destructive">
            Complete every disposal reading before submitting.
          </p>
        )}
      </ConfirmationDialog>
      <ConfirmationDialog
        open={deleteConfirmation.open}
        title="Delete report?"
        description="The report will be marked revoked. Submitted pump readings and lubricant stock movements will be rolled back."
        icon={Trash2}
        variant="danger"
        confirmText="Delete report"
        disabled={deleteReason.trim().length < 3}
        loading={deleteReportPending}
        onClose={deleteConfirmation.onClose}
        onConfirm={() => void remove()}
      >
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium">Reason</span>
          <Input
            value={deleteReason}
            maxLength={240}
            placeholder="Why is this report being deleted?"
            onChange={(event) => setDeleteReason(event.target.value)}
          />
        </label>
      </ConfirmationDialog>
    </>
  );
}
