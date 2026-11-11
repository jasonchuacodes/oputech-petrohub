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
} from '../reports.queries';
import { reportDetailFormSchema, type ReportDetailFormValues } from './report-detail.schema';
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
  const saveReport = useSaveReportDraftMutation(tenantId);
  const submitReport = useSubmitReportMutation(tenantId);
  const deleteReport = useDeleteReportMutation(tenantId);
  const reportRef = useRef(report);
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
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [failedSaveSignature, setFailedSaveSignature] = useState<string>();
  const administrator = role === 'admin' || role === 'superadmin';
  const reportOwner = report.creatorId === userId;
  const canEdit =
    report.status === 'draft' && !report.legacy && (administrator || reportOwner);
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
  const { isDirty, isValid } = form.formState;
  const valuesSignature = JSON.stringify(values);
  const saveFailed = saveState === 'error' && failedSaveSignature === valuesSignature;
  const pending = saveReport.isPending || submitReport.isPending || deleteReport.isPending;

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
      const submittedValues = cloneFormValues(form.getValues());
      setActionError(undefined);
      setSaveState('saving');
      setFailedSaveSignature(undefined);
      try {
        const updated = await saveReport.mutateAsync(toSaveInput(reportRef.current, formValues));
        reportRef.current = updated;
        const changedWhileSaving = !formValuesEqual(form.getValues(), submittedValues);
        if (!changedWhileSaving) form.reset(toFormValues(updated));
        setSaveState('saved');
        return updated;
      } catch {
        setSaveState('error');
        setFailedSaveSignature(JSON.stringify(submittedValues));
        setActionError('Unable to save. The report may have changed; reload before trying again.');
        return undefined;
      }
    },
    [form, saveReport],
  );

  const save = useCallback(
    async () => {
      const valid = await form.trigger();
      if (!valid) return undefined;
      const result = reportDetailFormSchema.safeParse(form.getValues());
      if (!result.success) return undefined;
      return persistDraft(result.data);
    },
    [form, persistDraft],
  );

  useEffect(() => {
    if (
      !canEdit ||
      !isDirty ||
      !isValid ||
      saveReport.isPending ||
      saveFailed ||
      submitReport.isPending ||
      deleteReport.isPending
    )
      return;
    const timer = window.setTimeout(() => {
      void save();
    }, 750);
    return () => window.clearTimeout(timer);
  }, [
    canEdit,
    deleteReport.isPending,
    isDirty,
    isValid,
    save,
    saveFailed,
    saveReport.isPending,
    submitReport.isPending,
    valuesSignature,
  ]);

  const submit = async () => {
    setActionError(undefined);
    try {
      let current = reportRef.current;
      if (isDirty) {
        const valid = await form.trigger();
        if (!valid) {
          submitConfirmation.onClose();
          return;
        }
        current = await saveReport.mutateAsync(toSaveInput(current, form.getValues()));
        reportRef.current = current;
        form.reset(toFormValues(current));
        setSaveState('saved');
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
    }
  };

  const remove = async () => {
    if (!report.disposals || deleteReason.trim().length < 3) return;
    setActionError(undefined);
    try {
      await deleteReport.mutateAsync({
        reportId: report.id,
        expectedReportRevision: report.revision,
        expectedDisposalRevision: report.disposals.revision,
        reason: deleteReason.trim(),
      });
      deleteConfirmation.onClose();
      toast.success('Report deleted and report effects rolled back');
    } catch {
      setActionError(
        'Unable to delete this report. A later report may already depend on its readings.',
      );
      deleteConfirmation.onClose();
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
    canDelete,
    isValid,
    pending,
    saveReportPending: saveReport.isPending,
    submitReportPending: submitReport.isPending,
    deleteReportPending: deleteReport.isPending,
    actionError,
    save,
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
