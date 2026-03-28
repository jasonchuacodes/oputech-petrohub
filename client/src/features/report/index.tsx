import { Stack, Typography, CircularProgress, Box, Divider, darken, lighten } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { CheckCircleOutline, DeleteOutline } from '@mui/icons-material';

import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { CardContainer, NoData, CustomModal, Button, Show } from '~/components/ui';
import { useAuthContext } from '~/context/auth/useAuthContext';
import { useDisclosure } from '~/hooks/useDisclosure';
import {
  useGetReportByIdQuery,
  useValidateReportMutation,
  useSubmitReportMutation,
  useUpdateRemarksMutation,
  useDeleteReportMutation,
} from '~/services/report/report.queries';
import { UserRoutes } from '~/routes';
import { ReportStatus } from '~/services/report/report.types';
import theme from '~/theme';
import { formatDate, formatTime } from '~/utils/date';
import { formatCurrency, formatNumber } from '~/utils/number';
import { parseBackendError } from '~/utils/parseBackendError';
import { pathFor } from '~/utils/pathFor';
import { toTitleCase } from '~/utils/textUtils';

import { Input } from '~/components/form/Input';
import { Shortcuts } from './Shortcuts';
import { EmployeesOnDuty } from './EmployeesOnDuty';
import { Income } from './Income';
import { Expenses } from './Expenses';
import { Inventory } from './Inventory';
import { MoreDetailsMenu } from './MoreDetailsMenu';

export const Report = () => {
  const { auth } = useAuthContext();
  const tenantId = auth?.tenantId || null;

  const { reportId } = useParams<{ reportId: string }>();
  const navigate = useNavigate();
  const validateDisclosure = useDisclosure();
  const deleteDisclosure = useDisclosure();

  const [validateWarning, setValidateWarning] = useState<'disposal' | 'employees'>('disposal');

  const { data: report, isLoading } = useGetReportByIdQuery({
    tenantId: tenantId!,
    reportId: reportId!,
  });
  const { mutateAsync: validateReport, isPending: isValidating } = useValidateReportMutation();
  const { mutate: saveRemarks } = useUpdateRemarksMutation();
  const { mutateAsync: submitReport, isPending: isSubmitting } = useSubmitReportMutation();
  const { mutateAsync: deleteReport, isPending: isDeleting } = useDeleteReportMutation();

  const { control: remarksControl } = useForm<{ remarks: string }>({
    values: { remarks: report?.remarks ?? '' },
    resetOptions: { keepDirtyValues: true },
  });
  const remarksValue = useWatch({ control: remarksControl, name: 'remarks' });

  const hasDisposalsChanged = (): boolean => {
    if (sessionStorage.getItem(`disposalsConfirmed:${reportId}`)) return true;
    if (!report?.disposals || report.disposals.length === 0) return true;

    return report.disposals.some(
      (disposal) => Number(disposal.beforeReading) !== Number(disposal.afterReading),
    );
  };

  const hasEmployeesAssigned = () => {
    return report?.employees && report.employees.length > 0;
  };

  const handleValidate = async () => {
    try {
      await validateReport(reportId!);
      toast.success('Report validated successfully');
      validateDisclosure.onClose();
    } catch (err) {
      const message = parseBackendError(err);
      toast.error(message);
    }
  };

  const handleValidateClick = () => {
    const disposalsChanged = hasDisposalsChanged();
    const employeesAssigned = hasEmployeesAssigned();

    if (!disposalsChanged) {
      setValidateWarning('disposal');
      validateDisclosure.onOpen();
      return;
    }

    if (!employeesAssigned) {
      setValidateWarning('employees');
      validateDisclosure.onOpen();
      return;
    }

    handleValidate();
  };

  const handleSubmit = async () => {
    try {
      await submitReport({ reportId: reportId!, remarks: remarksValue.trim() || null });
      toast.success('Report submitted successfully');
    } catch (err) {
      const message = parseBackendError(err);
      toast.error(message);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteReport(reportId!);
      toast.success('Report deleted successfully');
      navigate(pathFor({ pathname: UserRoutes.Home }));
    } catch (err) {
      const message = parseBackendError(err);
      toast.error(message);
    } finally {
      deleteDisclosure.onClose();
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
        <CircularProgress />
      </Box>
    );
  }

  if (!report) {
    return <NoData text="Report not found" />;
  }

  const [firstName, ...rest] = report.creator.name.split(' ');
  const lastName = rest.at(-1) ?? '';
  const ownerName = `${firstName} ${lastName}`;

  const isOwner = auth?.id === report.creatorId;
  const isReadOnly = report.status === ReportStatus.SUBMITTED || !isOwner;

  return (
    <Stack p={2} spacing={2}>
      <Stack spacing={1}>
        <Stack spacing={0.5}>
          <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap">
            <Typography variant="body1" color="text.primary" fontWeight={500}>
              {formatDate(new Date(), 'MMMM DD, YYYY')}
            </Typography>
          </Stack>
          <Typography variant="body1" color="text.secondary">
            {report.shift.name} Shift ({formatTime(report.periodStart)} -{' '}
            {formatTime(report.periodEnd)})
          </Typography>
        </Stack>

        {/* Report Summary */}
        <CardContainer
          p={0}
          borderColor="primary.main"
          borderRadius={2}
          bgcolor="primary.main"
          height="fit-content"
        >
          <Stack p={3} spacing={1}>
            <Stack justifyContent="space-between" direction="row" alignItems="start">
              <Stack>
                <Typography variant="body1" fontWeight={500} color="primary.alpha">
                  Net Sales
                </Typography>
                <Typography variant="h2" fontWeight={600} color="common.white">
                  {formatCurrency(report?.netTotal)}
                </Typography>
              </Stack>
              <Show when={report.status === ReportStatus.DRAFT && isOwner}>
                <MoreDetailsMenu onDelete={deleteDisclosure.onOpen} />
              </Show>
            </Stack>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography variant="body2" color="primary.alpha">
                Lubricants
              </Typography>
              <Typography variant="body2" color="primary.alpha">
                {formatCurrency(report?.totalInventorySales)}
              </Typography>
            </Stack>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography variant="body2" color="primary.alpha">
                Fuel Sales
              </Typography>
              <Typography variant="body2" color="primary.alpha">
                {formatCurrency(report?.totalSales)}
              </Typography>
            </Stack>

            <Divider sx={{ borderColor: 'primary.light' }} />

            <Stack pl={2} spacing={1}>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography variant="body2" color="primary.alpha">
                  Sales
                </Typography>
                <Typography variant="body2" color="primary.alpha">
                  {formatCurrency(report?.totalIncome)}
                </Typography>
              </Stack>

              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography variant="body2" color="primary.alpha">
                  Expenses
                </Typography>
                <Typography variant="body2" color="primary.alpha">
                  {formatCurrency(report?.totalExpenses)}
                </Typography>
              </Stack>

              <Divider sx={{ borderColor: 'primary.light' }} />
            </Stack>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography variant="body2" color="primary.alpha">
                Disposals Sales
              </Typography>
              <Typography variant="body2" color="primary.alpha">
                {formatCurrency(report?.totalDisposalSales)}
              </Typography>
            </Stack>
            <Divider sx={{ borderColor: 'primary.light' }} />
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography variant="body2" color="primary.alpha">
                {report.shortages >= 0 ? 'Shortages ' : 'Over'}
              </Typography>
              <Typography
                variant="body2"
                color={report.shortages > 0 ? lighten(theme.palette.error.main, 0.1) : 'warning'}
              >
                {report.shortages > 0
                  ? `(${formatNumber(Math.abs(report.shortages))})`
                  : formatNumber(Math.abs(report.shortages))}
              </Typography>
            </Stack>
          </Stack>

          <Divider sx={{ borderColor: 'primary.light' }} />
          <Stack
            p={2}
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            bgcolor={darken(theme.palette.primary.main, 0.05)}
          >
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="body2" color="primary.alpha">
                Status:
              </Typography>
              <Typography variant="body2" color="warning.main">
                {toTitleCase(report.status)}
              </Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="body2" color="primary.alpha">
                Created by:
              </Typography>
              <Typography variant="body2" color="primary.alpha">
                {ownerName}
              </Typography>
            </Stack>
          </Stack>
        </CardContainer>
      </Stack>

      <Shortcuts reportId={reportId!} isReadOnly={isReadOnly} />
      <EmployeesOnDuty reportId={reportId!} employees={report.employees} isReadOnly={isReadOnly} />
      <Show when={!(isReadOnly && report.income.length === 0)}>
        <Income
          reportId={reportId!}
          income={report.income}
          totalIncome={report.totalIncome}
          isReadOnly={isReadOnly}
        />
      </Show>
      <Show when={!(isReadOnly && report.expenses.length === 0)}>
        <Expenses
          reportId={reportId!}
          expenses={report.expenses}
          totalExpenses={report.totalExpenses}
          isReadOnly={isReadOnly}
        />
      </Show>
      <Show when={!(isReadOnly && report.inventories?.length === 0)}>
        <Inventory
          reportId={reportId!}
          inventories={report.inventories || []}
          totalInventorySales={report.totalInventorySales || 0}
          isReadOnly={isReadOnly}
        />
      </Show>

      <Stack spacing={0.5}>
        <Typography variant="body1" fontWeight={600} color="text.primary">
          Remarks
        </Typography>

        {isReadOnly ? (
          <CardContainer height="fit-content">
            <Typography
              variant="body2"
              color={remarksValue ? 'text.primary' : 'text.disabled'}
              sx={{ whiteSpace: 'pre-wrap' }}
            >
              {remarksValue || 'No remarks added.'}
            </Typography>
          </CardContainer>
        ) : (
          <Input
            name="remarks"
            control={remarksControl}
            placeholder="Add notes about this report..."
            multiline
            rows={3}
            fullWidth
            onBlur={() =>
              saveRemarks({ reportId: reportId!, remarks: remarksValue.trim() || null })
            }
          />
        )}
      </Stack>

      <Stack spacing={1}>
        <Show when={isOwner}>
          <Show
            when={report.status === ReportStatus.VALIDATED}
            fallback={
              report.status !== ReportStatus.SUBMITTED && (
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleValidateClick}
                  disabled={isValidating}
                  fullWidth
                >
                  <Typography>{isValidating ? 'Validating...' : 'Validate Report'}</Typography>
                </Button>
              )
            }
          >
            <Button
              variant="contained"
              size="large"
              startIcon={<CheckCircleOutline />}
              onClick={handleSubmit}
              disabled={isSubmitting}
              fullWidth
            >
              {isSubmitting ? 'Submitting...' : 'Submit Report'}
            </Button>
          </Show>
        </Show>
      </Stack>

      <CustomModal
        open={validateDisclosure.open}
        onClose={validateDisclosure.onClose}
        onSubmit={
          validateWarning === 'disposal'
            ? () => {
                validateDisclosure.onClose();
                navigate(
                  pathFor({ pathname: UserRoutes.ReportDisposal, params: { reportId: reportId! } }),
                );
              }
            : () => validateDisclosure.onClose()
        }
        title={validateWarning === 'disposal' ? 'Update Disposals' : 'Validate Report?'}
        subheader={
          validateWarning === 'disposal'
            ? 'Disposal readings have not been updated. Please update them before validating.'
            : 'No employees are assigned. Please assign employees before validating.'
        }
        icon={CheckCircleOutline}
        submitText={validateWarning === 'disposal' ? 'Go to Disposals' : 'Assign Employees'}
        cancelText="Cancel"
      />

      <CustomModal
        open={deleteDisclosure.open}
        onClose={deleteDisclosure.onClose}
        onSubmit={handleDelete}
        title="Delete Report?"
        subheader="Are you sure you want to delete this report?"
        type="danger"
        icon={DeleteOutline}
        submitText="Delete"
        cancelText="Cancel"
        loading={isDeleting}
      >
        <Stack spacing={2}>
          <Typography variant="body2">
            This action cannot be undone. Deleting this report will:
          </Typography>
          <Box component="ul" sx={{ pl: 2, mt: 0 }}>
            <li>
              <Typography variant="body2" color="text.secondary">
                Remove all report data
              </Typography>
            </li>
            <li>
              <Typography variant="body2" color="text.secondary">
                Allow someone else to create a report for this shift
              </Typography>
            </li>
          </Box>
        </Stack>
      </CustomModal>
    </Stack>
  );
};
