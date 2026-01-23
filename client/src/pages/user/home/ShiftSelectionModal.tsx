import { Description } from '@mui/icons-material';
import { Box, CircularProgress, Divider, MenuItem, Stack, Typography } from '@mui/material';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import { FormSelect } from '~/components/form/FormSelect';
import { CustomModal, Show } from '~/components/ui';
import { UserRoutes } from '~/routes';
import { type SelectShiftInput, SelectShiftSchema } from '~/schema/selectShiftSchema';
import { useCreateReportMutation, useGetReportsQuery } from '~/services/report/report.queries';
import { type Report, ReportStatus } from '~/services/report/report.types';
import { useGetShiftsQuery } from '~/services/shift/shift.queries';
import { type Shift } from '~/services/shift/shift.types';
import { dayjsLocal, formatTime } from '~/utils/date';
import { parseBackendError } from '~/utils/parseBackendError';
import { pathFor } from '~/utils/pathFor';

type ShiftSelectionModalProps = {
  open: boolean;
  onClose: () => void;
  tenantId: string | undefined;
};

type ShiftWithReport = {
  shift: Shift;
  report: Report | null;
  isEnabled: boolean;
  isCreatable: boolean;
};

const isBlockingStatus = (status: ReportStatus) =>
  status === ReportStatus.DRAFT || status === ReportStatus.VALIDATED;

const isSubmittedReport = (report: Report | null) => report?.status === ReportStatus.SUBMITTED;

export const ShiftSelectionModal = ({ open, onClose, tenantId }: ShiftSelectionModalProps) => {
  const navigate = useNavigate();
  const today = dayjsLocal().startOf('day').toISOString();

  const { data: shifts, isLoading: isLoadingShifts } = useGetShiftsQuery(tenantId);
  const { data: reports, isLoading: isLoadingReports } = useGetReportsQuery({
    tenantId,
    filters: { shiftDate: today },
  });

  const createReportMutation = useCreateReportMutation();

  const { blockingReport, shiftOptions, defaultShiftId, allSubmitted } = useMemo(() => {
    if (!shifts || !reports) {
      return { blockingReport: null, shiftOptions: [], defaultShiftId: null, allSubmitted: false };
    }

    const shiftsWithReports: ShiftWithReport[] = shifts.map((shift) => ({
      shift,
      report: reports.find((r) => r.shiftId === shift.id) || null,
      isEnabled: false,
      isCreatable: false,
    }));

    const blocking = shiftsWithReports.find(
      (item) => item.report && isBlockingStatus(item.report.status),
    );

    if (blocking) {
      return {
        blockingReport: blocking,
        shiftOptions: [],
        defaultShiftId: null,
        allSubmitted: false,
      };
    }

    const creatableIndex = shiftsWithReports.findIndex((item) => !isSubmittedReport(item.report));

    const options = shiftsWithReports.map((item, index) => ({
      ...item,
      isEnabled: isSubmittedReport(item.report) || index === creatableIndex,
      isCreatable: index === creatableIndex,
    }));

    const defaultId =
      creatableIndex >= 0
        ? shiftsWithReports[creatableIndex].shift.id
        : shiftsWithReports[0]?.shift.id || null;

    return {
      blockingReport: null,
      shiftOptions: options,
      defaultShiftId: defaultId,
      allSubmitted: creatableIndex === -1,
    };
  }, [shifts, reports]);

  const { control, handleSubmit, watch, reset } = useForm<SelectShiftInput>({
    resolver: zodResolver(SelectShiftSchema),
    defaultValues: { shiftId: blockingReport?.shift.id || defaultShiftId || '' },
  });

  useEffect(() => {
    const shiftId = blockingReport?.shift.id || defaultShiftId;
    if (shiftId) {
      reset({ shiftId });
    }
  }, [blockingReport, defaultShiftId, reset]);

  const selectedShiftId = watch('shiftId');
  const selectedShiftOption = shiftOptions.find((opt) => opt.shift.id === selectedShiftId);

  const submitButtonText = useMemo(() => {
    if (blockingReport || isSubmittedReport(selectedShiftOption?.report ?? null)) {
      return 'View Report';
    }
    return 'Create Report';
  }, [blockingReport, selectedShiftOption]);

  const navigateToReport = (reportId: string) => {
    navigate(pathFor({ pathname: UserRoutes.ReportDetail, params: { reportId } }));
    onClose();
  };

  const onSubmit = async (data: SelectShiftInput) => {
    if (!tenantId) return;

    const blockingReportId = blockingReport?.report?.id;
    if (blockingReportId) {
      navigateToReport(blockingReportId);
      return;
    }

    const selectedOption = shiftOptions.find((opt) => opt.shift.id === data.shiftId);
    const existingReportId = selectedOption?.report?.id;

    if (existingReportId && isSubmittedReport(selectedOption.report)) {
      navigateToReport(existingReportId);
      return;
    }

    try {
      const newReport = await createReportMutation.mutateAsync({
        tenantId,
        shiftId: data.shiftId,
        shiftDate: today,
      });

      toast.success('Report created successfully');
      navigateToReport(newReport.id);
    } catch (err) {
      const message = parseBackendError(err);
      toast.error(message);
    }
  };

  const isLoading = isLoadingShifts || isLoadingReports;

  const renderSubheader = () => {
    if (blockingReport) {
      return (
        <Typography variant="body2">
          There is a pending report for{' '}
          <Typography variant="inherit" component="span" color="warning.main">
            {blockingReport.shift.name}
          </Typography>{' '}
          shift.
        </Typography>
      );
    }

    if (allSubmitted) {
      return (
        <Typography variant="body2">
          All reports have been submitted for today. Select a shift to view the report.
        </Typography>
      );
    }

    return (
      <Typography variant="body2">
        You are about to create a report for{' '}
        <Typography variant="inherit" component="span" color="warning.main">
          {selectedShiftOption?.shift.name || 'selected'}
        </Typography>{' '}
        shift
      </Typography>
    );
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <Stack alignItems="center" justifyContent="center" py={4}>
          <CircularProgress size={40} />
        </Stack>
      );
    }

    if (blockingReport) {
      return (
        <Stack spacing={2}>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Shift: <strong>{blockingReport.shift.name}</strong>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Time: {formatTime(blockingReport.shift.shiftStart.toString())} -{' '}
              {formatTime(blockingReport.shift.shiftEnd.toString())}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Status: <strong>{blockingReport.report?.status}</strong>
            </Typography>
          </Box>
        </Stack>
      );
    }

    return (
      <Stack spacing={2}>
        <FormSelect name="shiftId" control={control} label="Select Shift" required>
          {shiftOptions.map((option) => (
            <MenuItem key={option.shift.id} value={option.shift.id} disabled={!option.isEnabled}>
              <Stack direction="row" justifyContent="space-between" width="100%" spacing={1}>
                <Typography variant="body2">{option.shift.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {formatTime(option.shift.shiftStart.toString())} -{' '}
                  {formatTime(option.shift.shiftEnd.toString())}
                </Typography>
              </Stack>
            </MenuItem>
          ))}
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
    );
  };

  return (
    <CustomModal
      open={open}
      onClose={onClose}
      title="Report Selection"
      subheader={renderSubheader()}
      onSubmit={handleSubmit(onSubmit)}
      submitText={submitButtonText}
      loading={createReportMutation.isPending}
      maxWidth={480}
      icon={Description}
    >
      {renderContent()}
    </CustomModal>
  );
};
