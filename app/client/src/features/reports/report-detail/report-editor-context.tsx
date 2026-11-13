'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import { useDisclosure } from '~/hooks/useDisclosure';
import {
  type ReportDetailRecord,
  useDeleteReportMutation,
  useSaveReportDraftMutation,
  useSubmitReportMutation,
  useUpdateReportRemarksMutation,
} from '../reports.queries';
import {
  reportDetailFormSchema,
  reportRemarksSchema,
  type ReportDetailFormValues,
} from './report-detail.schema';
import {
  calculatePreview,
  cloneFormValues,
  formValuesEqual,
  toFormValues,
  toSaveInput,
} from './utils';

type ReportEditorProviderProps = {
  report: ReportDetailRecord;
  tenantId: string;
  userId?: string;
  role: 'member' | 'admin' | 'superadmin';
  children: ReactNode;
};

type FinancialEntryTarget = {
  kind: 'income' | 'expense';
  index?: number;
};

function useReportEditorState({
  report,
  tenantId,
  userId,
  role,
}: Omit<ReportEditorProviderProps, 'children'>) {
  const { mutateAsync: saveReportDraft } = useSaveReportDraftMutation(tenantId);
  const submitReport = useSubmitReportMutation(tenantId);
  const deleteReport = useDeleteReportMutation(tenantId);
  const updateRemarks = useUpdateReportRemarksMutation(tenantId);
  const reportRef = useRef(report);
  const savedRemarksRef = useRef(report.remarks);
  const [tab, setTab] = useState<'detail' | 'lubricants' | 'disposals'>('detail');
  const submitConfirmation = useDisclosure();
  const reportActions = useDisclosure();
  const deleteConfirmation = useDisclosure();
  const financialEntryEditor = useDisclosure();
  const lubricantSaleEditor = useDisclosure();
  const [lubricantSaleIndex, setLubricantSaleIndex] = useState<number>();
  const [financialEntryTarget, setFinancialEntryTarget] = useState<FinancialEntryTarget>();
  const [deleteReason, setDeleteReason] = useState('');
  const [actionError, setActionError] = useState<string>();
  const [remarks, setRemarks] = useState(report.remarks);
  const [savedRemarks, setSavedRemarks] = useState(report.remarks);
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [failedSaveSignature, setFailedSaveSignature] = useState<string>();
  const [savedValuesSignature, setSavedValuesSignature] = useState(() =>
    JSON.stringify(toFormValues(report)),
  );
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [savingRemarks, setSavingRemarks] = useState(false);
  const savedValuesRef = useRef(cloneFormValues(toFormValues(report)));
  const failedSaveSignatureRef = useRef<string | undefined>(undefined);
  const inFlightSaveRef = useRef<Promise<ReportDetailRecord | undefined> | undefined>(undefined);
  const foregroundActionRef = useRef(false);
  const administrator = role === 'admin' || role === 'superadmin';
  const reportOwner = report.creatorId === userId;
  const canEdit =
    report.status === 'draft' && !report.legacy && (administrator || reportOwner);
  const canEditRemarks =
    (report.status === 'draft' && (administrator || reportOwner)) ||
    (report.status === 'submitted' && administrator);
  const canDelete =
    (administrator || reportOwner) &&
    report.status !== 'revoked' &&
    !report.legacy &&
    !report.disposals?.successorBatchId;
  const form = useForm<ReportDetailFormValues>({
    resolver: zodResolver(reportDetailFormSchema),
    defaultValues: toFormValues(report),
    mode: 'onChange',
  });
  const income = useFieldArray({
    control: form.control,
    name: 'incomeEntries',
    keyName: 'fieldKey',
  });
  const expenses = useFieldArray({
    control: form.control,
    name: 'expenseEntries',
    keyName: 'fieldKey',
  });
  const lubricants = useFieldArray({
    control: form.control,
    name: 'lubricantSales',
    keyName: 'fieldKey',
  });
  const values = useWatch({ control: form.control });
  const preview = calculatePreview(report, values);
  const { isValid } = form.formState;
  const watchedValuesResult = reportDetailFormSchema.safeParse(values);
  const valuesSignature = JSON.stringify(
    watchedValuesResult.success ? watchedValuesResult.data : values,
  );
  const saveFailed = saveState === 'error' && failedSaveSignature === valuesSignature;
  const hasUnsavedChanges = valuesSignature !== savedValuesSignature;
  const remarksDirty = remarks !== savedRemarks;
  const remarksValidation = reportRemarksSchema.safeParse(remarks);
  const pending =
    submitting || deleting || savingRemarks || submitReport.isPending || deleteReport.isPending;

  const openFinancialEntry = (kind: FinancialEntryTarget['kind'], index?: number) => {
    if (
      kind === 'income' &&
      index !== undefined &&
      form.getValues(`incomeEntries.${index}.recurringIncomeFieldId`)
    ) return;
    setFinancialEntryTarget({ kind, index });
    financialEntryEditor.onOpen();
  };

  const closeFinancialEntry = () => {
    financialEntryEditor.onClose();
    setFinancialEntryTarget(undefined);
  };

  const openLubricantSale = (index?: number) => {
    setTab('lubricants');
    setLubricantSaleIndex(index);
    lubricantSaleEditor.onOpen();
  };

  const closeLubricantSale = () => {
    lubricantSaleEditor.onClose();
    setLubricantSaleIndex(undefined);
  };

  useEffect(() => {
    if (report.revision >= reportRef.current.revision) reportRef.current = report;
  }, [report]);

  const persistDraft = useCallback(
    async (formValues: ReportDetailFormValues) => {
      const submittedValues = cloneFormValues(formValues);
      if (formValuesEqual(submittedValues, savedValuesRef.current)) return reportRef.current;

      while (inFlightSaveRef.current) {
        const pendingResult = await inFlightSaveRef.current;
        if (!pendingResult) return undefined;
        if (formValuesEqual(submittedValues, savedValuesRef.current)) return reportRef.current;
      }

      setSaveState('saving');
      setFailedSaveSignature(undefined);
      failedSaveSignatureRef.current = undefined;

      const request = (async () => {
        try {
          const updated = await saveReportDraft(toSaveInput(reportRef.current, submittedValues));
          reportRef.current = updated;
          savedValuesRef.current = submittedValues;
          setSavedValuesSignature(JSON.stringify(submittedValues));
          setSaveState('saved');
          return updated;
        } catch {
          const signature = JSON.stringify(submittedValues);
          failedSaveSignatureRef.current = signature;
          setSaveState('error');
          setFailedSaveSignature(signature);
          setActionError('Unable to save. The report may have changed; reload before trying again.');
          return undefined;
        } finally {
          inFlightSaveRef.current = undefined;
        }
      })();
      inFlightSaveRef.current = request;
      return request;
    },
    [saveReportDraft],
  );

  const saveLatestDraft = useCallback(async () => {
    let updated: ReportDetailRecord | undefined;
    while (!foregroundActionRef.current) {
      const result = reportDetailFormSchema.safeParse(form.getValues());
      if (!result.success) return updated;
      const snapshot = cloneFormValues(result.data);
      const signature = JSON.stringify(snapshot);
      if (formValuesEqual(snapshot, savedValuesRef.current)) {
        return updated ?? reportRef.current;
      }
      if (failedSaveSignatureRef.current === signature) return undefined;
      updated = await persistDraft(snapshot);
      if (!updated) return undefined;
    }
    return updated;
  }, [form, persistDraft]);

  const save = useCallback(
    async () => {
      const valid = await form.trigger();
      if (!valid) return undefined;
      const result = reportDetailFormSchema.safeParse(form.getValues());
      if (!result.success) return undefined;
      setActionError(undefined);
      return persistDraft(result.data);
    },
    [form, persistDraft],
  );

  useEffect(() => {
    if (
      !canEdit ||
      !hasUnsavedChanges ||
      !isValid ||
      saveFailed ||
      pending
    )
      return;
    const timer = window.setTimeout(() => {
      void saveLatestDraft();
    }, 750);
    return () => window.clearTimeout(timer);
  }, [
    canEdit,
    hasUnsavedChanges,
    isValid,
    pending,
    saveLatestDraft,
    saveFailed,
    saveState,
    valuesSignature,
  ]);

  const persistRemarks = async (current: ReportDetailRecord) => {
    const result = reportRemarksSchema.safeParse(remarks);
    if (!result.success) {
      setActionError(result.error.issues[0]?.message ?? 'Review the remarks and try again.');
      return undefined;
    }
    const updated = await updateRemarks.mutateAsync({
      reportId: current.id,
      expectedRevision: current.revision,
      remarks: result.data,
    });
    reportRef.current = updated;
    savedRemarksRef.current = updated.remarks;
    setSavedRemarks(updated.remarks);
    setRemarks(updated.remarks);
    return updated;
  };

  const saveRemarks = async () => {
    if (!canEditRemarks || !remarksDirty || foregroundActionRef.current) return;
    foregroundActionRef.current = true;
    setSavingRemarks(true);
    setActionError(undefined);
    try {
      await inFlightSaveRef.current;
      const updated = await persistRemarks(reportRef.current);
      if (updated) toast.success('Remarks saved');
    } catch {
      setActionError('Unable to save remarks. The report may have changed; reload before trying again.');
    } finally {
      foregroundActionRef.current = false;
      setSavingRemarks(false);
    }
  };

  const submit = async () => {
    if (foregroundActionRef.current) return;
    foregroundActionRef.current = true;
    setSubmitting(true);
    setActionError(undefined);
    try {
      let current = reportRef.current;
      const valid = await form.trigger();
      if (!valid) {
        submitConfirmation.onClose();
        return;
      }
      const valuesResult = reportDetailFormSchema.safeParse(form.getValues());
      if (!valuesResult.success) {
        submitConfirmation.onClose();
        return;
      }
      const saved = await persistDraft(valuesResult.data);
      if (!saved) {
        submitConfirmation.onClose();
        return;
      }
      current = saved;
      if (remarks !== savedRemarksRef.current) {
        const updated = await persistRemarks(current);
        if (!updated) {
          submitConfirmation.onClose();
          return;
        }
        current = updated;
      }
      if (!current.disposals?.complete) {
        submitConfirmation.onClose();
        setTab('disposals');
        setActionError('Complete every closing reading before submitting.');
        return;
      }
      await submitReport.mutateAsync({
        reportId: current.id,
        expectedReportRevision: current.revision,
        expectedDisposalRevision: current.disposals.revision,
      });
      submitConfirmation.onClose();
      toast.success('Report submitted');
    } catch {
      setActionError('Unable to submit. Refresh and review the latest report values.');
    } finally {
      foregroundActionRef.current = false;
      setSubmitting(false);
    }
  };

  const remove = async () => {
    if (deleteReason.trim().length < 3 || foregroundActionRef.current) return;
    foregroundActionRef.current = true;
    setDeleting(true);
    setActionError(undefined);
    try {
      await inFlightSaveRef.current;
      const current = reportRef.current;
      if (!current.disposals) return;
      await deleteReport.mutateAsync({
        reportId: current.id,
        expectedReportRevision: current.revision,
        expectedDisposalRevision: current.disposals.revision,
        reason: deleteReason.trim(),
      });
      deleteConfirmation.onClose();
      toast.success('Report deleted and report effects rolled back');
    } catch {
      setActionError(
        'Unable to delete this report. A later report may already depend on its readings.',
      );
      deleteConfirmation.onClose();
    } finally {
      foregroundActionRef.current = false;
      setDeleting(false);
    }
  };

  return {
    report,
    tenantId,
    form,
    income,
    expenses,
    lubricants,
    preview,
    tab,
    setTab,
    canEdit,
    canEditRemarks,
    canDelete,
    isValid,
    pending,
    remarks,
    setRemarks,
    remarksDirty,
    remarksValid: remarksValidation.success,
    remarksError: remarksValidation.success ? undefined : remarksValidation.error.issues[0]?.message,
    remarksPending: savingRemarks,
    saveReportPending: saveState === 'saving',
    submitReportPending: submitting,
    deleteReportPending: deleting,
    actionError,
    save,
    saveRemarks,
    submit,
    remove,
    reportActions,
    submitConfirmation,
    deleteConfirmation,
    financialEntryEditor,
    financialEntryTarget,
    openFinancialEntry,
    closeFinancialEntry,
    lubricantSaleEditor,
    lubricantSaleIndex,
    openLubricantSale,
    closeLubricantSale,
    deleteReason,
    setDeleteReason,
  };
}

type ReportEditorContextValue = ReturnType<typeof useReportEditorState>;

const ReportEditorContext = createContext<ReportEditorContextValue | null>(null);

export function ReportEditorProvider({ children, ...props }: ReportEditorProviderProps) {
  const value = useReportEditorState(props);
  return <ReportEditorContext.Provider value={value}>{children}</ReportEditorContext.Provider>;
}

export function useReportEditor() {
  const context = useContext(ReportEditorContext);
  if (!context) throw new Error('useReportEditor must be used within ReportEditorProvider');
  return context;
}
