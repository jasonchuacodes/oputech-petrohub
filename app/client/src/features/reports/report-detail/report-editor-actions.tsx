'use client';

import { CheckCircle2, Trash2 } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { ConfirmationDialog } from '~/components/ui/confirmation-dialog';
import { Input } from '~/components/ui/input';
import { Spinner } from '~/components/ui/spinner';
import { cn } from '~/utils/cn';
import { SummaryCard } from './report-details';
import { useReportEditor } from './report-editor-context';

export function ReportEditorFooter() {
  const {
    canEdit,
    canDelete,
    pending,
    isValid,
    saveReportPending,
    submitConfirmation,
    deleteConfirmation,
  } = useReportEditor();

  if (!canEdit && !canDelete) return null;

  return (
    <footer className="sticky bottom-0 -mx-5 mt-auto flex flex-wrap gap-3 bg-[#f5f5f5] px-5 pt-4 pb-[calc(1rem+env(safe-area-inset-bottom))] shadow-[0_-6px_16px_rgba(16,16,16,0.08)] md:-mx-6 md:px-6">
      <div className="flex flex-1 gap-3">
        {canEdit && (
          <Button
            type="button"
            size="lg"
            className="flex-1 rounded-md shadow-[0_4px_14px_rgba(16,16,16,0.14)]"
            disabled={pending || !isValid}
            onClick={submitConfirmation.onOpen}
          >
            {saveReportPending ? <Spinner className="size-4" /> : <CheckCircle2 aria-hidden="true" />}
            {saveReportPending ? 'Saving draft…' : 'Review and submit'}
          </Button>
        )}
        {canDelete && (
          <Button
            type="button"
            variant="destructive"
            className={cn(
              'rounded-md shadow-[0_4px_14px_rgba(16,16,16,0.14)]',
              !canEdit && 'ml-auto',
            )}
            disabled={pending}
            onClick={deleteConfirmation.onOpen}
          >
            <Trash2 aria-hidden="true" />
            Delete report
          </Button>
        )}
      </div>
    </footer>
  );
}

export function ReportEditorDialogs() {
  const {
    preview,
    submitConfirmation,
    deleteConfirmation,
    submitReportPending,
    saveReportPending,
    deleteReportPending,
    submit,
    remove,
    deleteReason,
    setDeleteReason,
  } = useReportEditor();

  return (
    <>
      <ConfirmationDialog
        open={submitConfirmation.open}
        title="Submit report?"
        description="Review the summary and disposal readings before submitting."
        icon={CheckCircle2}
        confirmText="Submit report"
        loading={submitReportPending || saveReportPending}
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
        description="The report will be marked revoked. Submitted pump readings will roll back to their openings."
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
