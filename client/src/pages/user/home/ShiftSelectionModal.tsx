import { CheckCircle, Description } from '@mui/icons-material';
import { Box, Divider, MenuItem, Stack, Typography } from '@mui/material';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import { FormSelect } from '~/components/form/FormSelect';
import { Chip, CustomModal, LoadingSpinner, Show } from '~/components/ui';
import { UserRoutes } from '~/routes';
import { type SelectShiftInput, SelectShiftSchema } from '~/schema/selectShiftSchema';
import { useCreateReportMutation, useGetReportsQuery } from '~/services/report/report.queries';
import { type Report, ReportStatus, type ShiftPeriod } from '~/services/report/report.types';
import { useShiftPeriodsQuery } from '~/services/shift/shift.queries';
import { dayjsLocal, formatTime } from '~/utils/date';
import { parseBackendError } from '~/utils/parseBackendError';
import { pathFor } from '~/utils/pathFor';

type ShiftSelectionModalProps = {
  open: boolean;
  onClose: () => void;
  tenantId: string | undefined;
};

type ShiftPeriodWithReport = {
  period: ShiftPeriod;
  report: Report | null;
  isEnabled: boolean;
  isCreatable: boolean;
};

const isSubmittedReport = (report: Report | null) => report?.status === ReportStatus.SUBMITTED;
const makePeriodKey = (period: ShiftPeriod) => `${period.shiftId}|${period.periodStart}`;

export const ShiftSelectionModal = ({ open, onClose, tenantId }: ShiftSelectionModalProps) => {
  const navigate = useNavigate();
  const today = dayjsLocal().startOf('day').toISOString();

  const { data: shiftPeriods, isLoading: isLoadingPeriods } = useShiftPeriodsQuery(today);
  const { data: reports, isLoading: isLoadingReports } = useGetReportsQuery({
    tenantId,
    filters: { shiftDate: today },
  });
  const createReportMutation = useCreateReportMutation();

  const { blockingReport, periodOptions, defaultPeriodKey, allSubmitted } = useMemo(() => {
    if (!shiftPeriods || !reports) {
      return {
        blockingReport: null,
        periodOptions: [],
        defaultPeriodKey: null,
        allSubmitted: false,
      };
    }

    const periodsWithReports: ShiftPeriodWithReport[] = shiftPeriods.map((period) => ({
      period,
      report:
        reports.find((r) => r.shiftId === period.shiftId && r.periodStart === period.periodStart) ||
        null,
      isEnabled: false,
      isCreatable: false,
    }));

    const blocking = periodsWithReports.find(
      (item) =>
        item.report &&
        (item.report.status === ReportStatus.DRAFT ||
          item.report.status === ReportStatus.VALIDATED),
    );

    if (blocking) {
      return {
        blockingReport: blocking,
        periodOptions: [],
        defaultPeriodKey: null,
        allSubmitted: false,
      };
    }

    const creatableIndex = periodsWithReports.findIndex((item) => !isSubmittedReport(item.report));

    const options = periodsWithReports.map((item, index) => ({
      ...item,
      isEnabled: isSubmittedReport(item.report) || index === creatableIndex,
      isCreatable: index === creatableIndex,
    }));

    const defaultKey =
      creatableIndex >= 0
        ? makePeriodKey(periodsWithReports[creatableIndex].period)
        : (periodsWithReports[0] && makePeriodKey(periodsWithReports[0].period)) || null;

    return {
      blockingReport: null,
      periodOptions: options,
      defaultPeriodKey: defaultKey,
      allSubmitted: creatableIndex === -1,
    };
  }, [shiftPeriods, reports]);

  const { control, handleSubmit, watch, reset } = useForm<SelectShiftInput>({
    resolver: zodResolver(SelectShiftSchema),
    defaultValues: {
      periodKey: (blockingReport && makePeriodKey(blockingReport.period)) || defaultPeriodKey || '',
    },
  });

  const selectedPeriodKey = watch('periodKey');
  const selectedPeriodOption = periodOptions.find(
    (opt) => makePeriodKey(opt.period) === selectedPeriodKey,
  );

  const navigateToReport = (reportId: string) => {
    navigate(pathFor({ pathname: UserRoutes.ReportDetail, params: { reportId } }));
    onClose();
  };

  const onSubmit = async (data: SelectShiftInput) => {
    if (!tenantId) return;

    if (blockingReport?.report?.id) {
      navigateToReport(blockingReport.report.id);
      return;
    }

    const selectedOption = periodOptions.find(
      (opt) => makePeriodKey(opt.period) === data.periodKey,
    );

    if (selectedOption?.report?.id && isSubmittedReport(selectedOption.report)) {
      navigateToReport(selectedOption.report.id);
      return;
    }

    try {
      const newReport = await createReportMutation.mutateAsync({
        tenantId,
        shiftId: selectedOption!.period.shiftId,
        periodStart: selectedOption!.period.periodStart,
        periodEnd: selectedOption!.period.periodEnd,
      });

      toast.success('Report created successfully');
      navigateToReport(newReport.id);
    } catch (err) {
      toast.error(parseBackendError(err));
    }
  };

  useEffect(() => {
    const periodKey = (blockingReport && makePeriodKey(blockingReport.period)) || defaultPeriodKey;
    if (periodKey) {
      reset({ periodKey });
    }
  }, [blockingReport, defaultPeriodKey, reset]);

  return (
    <CustomModal
      open={open}
      onClose={onClose}
      title="Report Selection"
      subheader={
        blockingReport ? (
          <Typography variant="body2">
            There is a pending report for{' '}
            <Typography variant="inherit" component="span" color="warning.main">
              {blockingReport.period.shiftName}
            </Typography>
          </Typography>
        ) : allSubmitted ? (
          <Typography variant="body2">
            All reports have been submitted for today. Select a shift period to view the report.
          </Typography>
        ) : (
          <Typography variant="body2">
            You are about to create a report for{' '}
            <Typography variant="inherit" component="span" color="warning.main">
              {selectedPeriodOption?.period.shiftName || 'selected'} Shift
            </Typography>
          </Typography>
        )
      }
      onSubmit={handleSubmit(onSubmit)}
      submitText={useMemo(() => {
        if (blockingReport || isSubmittedReport(selectedPeriodOption?.report ?? null)) {
          return 'View Report';
        }
        return 'Create Report';
      }, [blockingReport, selectedPeriodOption])}
      loading={createReportMutation.isPending}
      maxWidth={480}
      icon={Description}
    >
      {isLoadingPeriods || isLoadingReports ? (
        <Stack alignItems="center" justifyContent="center" py={4}>
          <LoadingSpinner />
        </Stack>
      ) : blockingReport ? (
        <Stack spacing={0.5}>
          <Typography variant="body2" color="text.secondary">
            Shift: <strong>{blockingReport.period.shiftName}</strong>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Period: {formatTime(blockingReport.period.periodStart)} -{' '}
            {formatTime(blockingReport.period.periodEnd)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Status: <Chip label={blockingReport.report?.status} />
          </Typography>
        </Stack>
      ) : (
        <Stack spacing={2}>
          <FormSelect name="periodKey" control={control} label="Select Shift Period" required>
            {periodOptions.map((option) => {
              const key = makePeriodKey(option.period);
              return (
                <MenuItem key={key} value={key} disabled={!option.isEnabled}>
                  <Stack direction="row" justifyContent="space-between" width="100%" spacing={1}>
                    <Typography variant="body2">{option.period.label}</Typography>
                    <Show when={isSubmittedReport(option.report)}>
                      <CheckCircle color="success" fontSize="small" />
                    </Show>
                  </Stack>
                </MenuItem>
              );
            })}
          </FormSelect>

          <Show when={!allSubmitted}>
            <Divider />

            <Box>
              <Typography variant="body2" color="warning.main" fontWeight={600}>
                Important:
              </Typography>
              <Box component="ul" sx={{ mt: 1, pl: 2 }}>
                <li>
                  <Typography variant="body2">You will be marked as the report owner</Typography>
                </li>
                <li>
                  <Typography variant="body2">Only you can edit this report</Typography>
                </li>
              </Box>
            </Box>
          </Show>
        </Stack>
      )}
    </CustomModal>
  );
};
