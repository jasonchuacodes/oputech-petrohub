'use client';

import Decimal from 'decimal.js';
import { useId, useRef, useState, type RefObject } from 'react';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Sheet } from '~/components/ui/sheet';
import type { ReportDetailRecord } from '../reports.queries';
import { disposalReadingSchema } from './report-detail.schema';
import { useReportEditor } from './report-editor-context';
import {
  calculatePreview,
  formatCurrentReading,
  formatDisposalVolume,
  formatMoney,
  formatReading,
} from './utils';

type DisposalReading = NonNullable<ReportDetailRecord['disposals']>['readings'][number];

type DisposalReadingSheetProps = {
  reading: DisposalReading;
  index: number;
  onClose: () => void;
  returnFocusRef: RefObject<HTMLElement | null>;
};

export function DisposalReadingSheet({
  reading,
  index,
  onClose,
  returnFocusRef,
}: DisposalReadingSheetProps) {
  const {
    report,
    form,
    canEdit,
    submitReportPending,
    deleteReportPending,
    actionError,
    save,
  } = useReportEditor();
  const currentReadingRef = useRef<HTMLInputElement>(null);
  const [focusedField, setFocusedField] = useState<'currentReading' | 'calibration'>();
  const [initialValues] = useState(() => ({
    closingReading: form.getValues(`disposalReadings.${index}.closingReading`),
    calibration: form.getValues(`disposalReadings.${index}.calibration`),
  }));
  const [draft, setDraft] = useState(() => ({
    ...initialValues,
    calibration: isZero(initialValues.calibration) ? '' : initialValues.calibration,
  }));
  const [blurred, setBlurred] = useState({ currentReading: false, calibration: false });
  const [saveAttempted, setSaveAttempted] = useState(false);
  const [saving, setSaving] = useState(false);
  const currentReadingId = useId();
  const calibrationId = useId();
  const currentReadingErrorId = useId();
  const calibrationErrorId = useId();
  const editingDisabled = !canEdit || submitReportPending || deleteReportPending || saving;
  const formReadings = form.watch('disposalReadings');
  const currentReading = formReadings[index]?.closingReading;
  const calculated = calculatePreview(report, {
    disposalReadings: formReadings.map((value, readingIndex) =>
      readingIndex === index ? { ...value, ...draft } : value,
    ),
  }).readings[index];
  const validation = disposalReadingSchema.safeParse({
    meterId: reading.meterId,
    ...draft,
    calibration: draft.calibration || '0',
  });
  const fieldErrors = validation.success ? {} : validation.error.flatten().fieldErrors;
  const currentReadingError = fieldErrors.closingReading?.[0];
  const calibrationError = fieldErrors.calibration?.[0];
  const showCurrentReadingError = Boolean(
    currentReadingError &&
      (blurred.currentReading || saveAttempted) &&
      focusedField !== 'currentReading',
  );
  const showCalibrationError = Boolean(
    calibrationError &&
      (blurred.calibration || saveAttempted) &&
      focusedField !== 'calibration',
  );

  const handleClose = () => {
    if (!saving) onClose();
  };

  const handleSave = async () => {
    setSaveAttempted(true);
    if (!validation.success) return;
    if (
      validation.data.closingReading === initialValues.closingReading &&
      (validation.data.calibration === initialValues.calibration ||
        (draft.calibration === '' && isZero(initialValues.calibration)))
    ) {
      onClose();
      return;
    }

    setSaving(true);
    form.setValue(`disposalReadings.${index}.closingReading`, validation.data.closingReading, {
      shouldDirty: true,
      shouldValidate: true,
    });
    form.setValue(`disposalReadings.${index}.calibration`, validation.data.calibration, {
      shouldDirty: true,
      shouldValidate: true,
    });
    const result = await save();
    setSaving(false);
    if (result) {
      onClose();
      return;
    }
    form.setValue(`disposalReadings.${index}.closingReading`, initialValues.closingReading, {
      shouldDirty: true,
      shouldValidate: true,
    });
    form.setValue(`disposalReadings.${index}.calibration`, initialValues.calibration, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  return (
    <Sheet
      open
      title="Disposal Reading"
      description={`${reading.meterLabel} · ${reading.productName}`}
      onClose={handleClose}
      escapeDisabled={saving}
      manageFocus
      initialFocusRef={canEdit ? currentReadingRef : undefined}
      returnFocusRef={returnFocusRef}
    >
      <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-5">
        <dl className="divide-y divide-border/60 border-y border-border/60">
          {canEdit ? (
            <div className="grid min-h-16 grid-cols-[minmax(0,1fr)_minmax(0,11rem)] items-center gap-4 py-3">
              <dt>
                <label
                  htmlFor={currentReadingId}
                  className="text-sm text-text-secondary"
                >
                  After reading
                </label>
              </dt>
              <dd>
                <Input
                  ref={currentReadingRef}
                  id={currentReadingId}
                  className="text-right text-lg tabular-nums"
                  inputMode="decimal"
                  placeholder="0.00"
                  value={draft.closingReading}
                  disabled={editingDisabled}
                  aria-invalid={showCurrentReadingError}
                  aria-describedby={showCurrentReadingError ? currentReadingErrorId : undefined}
                  onFocus={() => setFocusedField('currentReading')}
                  onChange={(event) => {
                    setDraft((current) => ({
                      ...current,
                      closingReading: event.target.value,
                    }));
                  }}
                  onBlur={() => {
                    setFocusedField(undefined);
                    setBlurred((current) => ({ ...current, currentReading: true }));
                  }}
                />
                {showCurrentReadingError && currentReadingError && (
                  <p id={currentReadingErrorId} className="mt-2 text-sm text-destructive">
                    {currentReadingError}
                  </p>
                )}
              </dd>
            </div>
          ) : (
            <DetailRow
              label="After reading"
              value={formatCurrentReading(currentReading)}
              tabular
            />
          )}
          <DetailRow
            label="Before reading"
            value={formatReading(reading.openingReading)}
            tabular
          />
          {canEdit ? (
            <div className="grid min-h-16 grid-cols-[minmax(0,1fr)_minmax(0,11rem)] items-center gap-4 py-3">
              <dt>
                <label htmlFor={calibrationId} className="text-sm text-text-secondary">
                  Calibration
                </label>
              </dt>
              <dd>
                <Input
                  id={calibrationId}
                  className="text-right tabular-nums"
                  inputMode="decimal"
                  placeholder="0.00"
                  value={draft.calibration}
                  disabled={editingDisabled}
                  aria-invalid={showCalibrationError}
                  aria-describedby={showCalibrationError ? calibrationErrorId : undefined}
                  onFocus={() => setFocusedField('calibration')}
                  onChange={(event) => {
                    setDraft((current) => ({ ...current, calibration: event.target.value }));
                  }}
                  onBlur={() => {
                    setFocusedField(undefined);
                    setBlurred((current) => ({ ...current, calibration: true }));
                  }}
                />
                {showCalibrationError && calibrationError && (
                  <p id={calibrationErrorId} className="mt-2 text-sm text-destructive">
                    {calibrationError}
                  </p>
                )}
              </dd>
            </div>
          ) : (
            <DetailRow label="Calibration" value={formatReading(reading.calibration)} tabular />
          )}
          <DetailRow
            label="Disposal"
            value={formatDisposalVolume(calculated?.net)}
            tabular
          />
          <DetailRow label="Price" value={formatMoney(reading.unitPrice)} tabular />
          <DetailRow
            label="Computed sales"
            value={calculated?.sales ? formatMoney(calculated.sales) : '—'}
            tabular
          />
        </dl>

        {!canEdit && (
          <p className="mt-4 text-sm text-text-secondary">This report is read-only.</p>
        )}
        {actionError && (
          <p role="alert" className="mt-4 text-sm text-destructive">
            {actionError}
          </p>
        )}
      </div>
      <footer className="shrink-0 border-t border-border p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
        {canEdit ? (
          <div className="grid grid-cols-2 gap-3">
            <Button type="button" variant="outline" disabled={saving} onClick={handleClose}>
              Cancel
            </Button>
            <Button type="button" disabled={editingDisabled} onClick={() => void handleSave()}>
              {saving ? 'Saving…' : 'Save'}
            </Button>
          </div>
        ) : (
          <Button type="button" variant="outline" className="w-full" onClick={onClose}>
            Done
          </Button>
        )}
      </footer>
    </Sheet>
  );
}

function DetailRow({
  label,
  value,
  tabular = false,
}: {
  label: string;
  value: string;
  tabular?: boolean;
}) {
  return (
    <div className="flex min-h-14 items-center justify-between gap-4 py-3">
      <dt className="text-sm text-text-secondary">{label}</dt>
      <dd className={`text-right ${tabular ? 'tabular-nums' : ''}`}>
        <span className="text-text-heading">{value}</span>
      </dd>
    </div>
  );
}

function isZero(value: string) {
  try {
    return new Decimal(value).isZero();
  } catch {
    return false;
  }
}
