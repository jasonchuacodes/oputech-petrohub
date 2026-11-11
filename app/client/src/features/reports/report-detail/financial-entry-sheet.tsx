'use client';

import { useCallback, useEffect, useId, useState } from 'react';
import { createPortal } from 'react-dom';
import { useForm, useWatch } from 'react-hook-form';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { NumberInput } from '~/components/ui/number-input';
import { reportEntrySchema } from './report-detail.schema';
import { useReportEditor } from './report-editor-context';

type FinancialEntrySheetProps = {
  kind: 'income' | 'expense';
  index?: number;
  onClose: () => void;
};

export function FinancialEntrySheet({ kind, index, onClose }: FinancialEntrySheetProps) {
  const { income, expenses } = useReportEditor();
  const fieldArray = kind === 'income' ? income : expenses;
  const entry = index === undefined ? undefined : fieldArray.fields[index];
  const [description, setDescription] = useState(entry?.description ?? '');
  const amountForm = useForm<{ amount?: number }>({
    defaultValues: { amount: entry ? Number(entry.amount) : undefined },
  });
  const amount = useWatch({ control: amountForm.control, name: 'amount' });
  const titleId = useId();
  const descriptionId = useId();
  const title = `${entry ? 'Edit' : 'Add'} ${kind}`;
  const result = reportEntrySchema.safeParse({
    id: entry?.id ?? 'new-entry',
    description,
    notes: entry?.notes ?? '',
    amount: amount === undefined ? '' : String(amount),
  });
  const close = useCallback(() => onClose(), [onClose]);

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [close]);

  const apply = () => {
    if (!result.success) return;
    const next = {
      ...result.data,
      id: entry?.id ?? crypto.randomUUID(),
    };
    if (index === undefined) fieldArray.append(next);
    else fieldArray.update(index, next);
    close();
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center wide:items-center wide:p-6">
      <button
        type="button"
        aria-label={`Close ${title.toLowerCase()} sheet`}
        tabIndex={-1}
        className="absolute inset-0 bg-black/55 backdrop-blur-[2px]"
        onClick={close}
      />
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className="relative flex max-h-[90dvh] w-full flex-col overflow-hidden rounded-t-sheet bg-card shadow-2xl wide:max-w-xl wide:rounded-lg"
      >
        <div
          aria-hidden="true"
          className="mx-auto mt-3 h-1.5 w-14 shrink-0 rounded-full bg-foreground/35 wide:hidden"
        />
        <header className="shrink-0 p-5 pb-4">
          <h2 id={titleId} className="text-xl font-semibold text-text-heading">
            {title}
          </h2>
          <p id={descriptionId} className="mt-1 text-sm text-text-secondary">
            Enter the description and amount for this report.
          </p>
        </header>
        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-5 pb-5">
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium">Description</span>
            <Input
              autoFocus
              value={description}
              maxLength={120}
              placeholder={`Enter ${kind} description`}
              onChange={(event) => setDescription(event.target.value)}
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium">Amount</span>
            <NumberInput
              control={amountForm.control}
              name="amount"
              step={0.01}
              min={0.01}
              placeholder="0.00"
            />
          </label>
        </div>
        <footer className="flex shrink-0 gap-3 border-t border-border p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
          <Button type="button" variant="outline" className="flex-1" onClick={close}>
            Cancel
          </Button>
          <Button type="button" className="flex-1" disabled={!result.success} onClick={apply}>
            {entry ? 'Save changes' : `Add ${kind}`}
          </Button>
        </footer>
      </section>
    </div>,
    document.body,
  );
}
