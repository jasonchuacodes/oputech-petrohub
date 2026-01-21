import { Stack, Typography, CircularProgress, Box, Divider } from '@mui/material';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { CheckCircleOutline } from '@mui/icons-material';

import { CardContainer, NoData, CustomModal, Button, Show } from '~/components/ui';
import { useAuthContext } from '~/context/auth/useAuthContext';
import { useDisclosure } from '~/hooks/useDisclosure';
import {
  useGetReportByIdQuery,
  useValidateReportMutation,
  useSubmitReportMutation,
} from '~/services/report/report.queries';
import { ReportStatus } from '~/services/report/report.types';
import { formatDate } from '~/utils/date';
import { formatCurrency, formatNumber } from '~/utils/number';
import { parseBackendError } from '~/utils/parseBackendError';

import { Shortcuts } from './Shortcuts';
import { EmployeesOnDuty } from './EmployeesOnDuty';
import { Income } from './Income';
import { Expenses } from './Expenses';
import { Inventory } from './Inventory';

export const ReportDetail = () => {
  const { auth } = useAuthContext();
  const { reportId } = useParams<{ reportId: string }>();

  const tenantId = auth?.tenantId || null;

  const { data: report, isLoading } = useGetReportByIdQuery({
    tenantId: tenantId!,
    reportId: reportId!,
  });

  const {
    open: showConfirmModal,
    onOpen: openConfirmModal,
    onClose: closeConfirmModal,
  } = useDisclosure();
  const { mutateAsync: validateReport, isPending: isValidating } = useValidateReportMutation();
  const { mutateAsync: submitReport, isPending: isSubmitting } = useSubmitReportMutation();

  const hasDisposalsChanged = (): boolean => {
    if (!report?.disposals || report.disposals.length === 0) return true;
    return report.disposals.some(
      (disposal) => Number(disposal.beforeReading) !== Number(disposal.afterReading),
    );
  };

  const handleValidateClick = () => {
    const changed = hasDisposalsChanged();
    if (changed) {
      handleValidate();
    } else {
      openConfirmModal();
    }
  };

  const handleValidate = async () => {
    try {
      await validateReport(reportId!);
      toast.success('Report validated successfully');
      closeConfirmModal();
    } catch (err) {
      const message = parseBackendError(err);
      toast.error(message);
    }
  };

  const handleSubmit = async () => {
    try {
      await submitReport(reportId!);
      toast.success('Report submitted successfully');
    } catch (err) {
      const message = parseBackendError(err);
      toast.error(message);
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

  const isReadOnly = report.status === ReportStatus.SUBMITTED;

  return (
    <Stack p={2} spacing={2}>
      <Stack spacing={1}>
        <Typography
          width="fit-content"
          variant="body1"
          color="text.primary"
          fontWeight={500}
          borderRadius={2}
        >
          {formatDate(new Date(), 'MMMM DD, YYYY')} — {report.shift.name} Shift
        </Typography>

        {/* Report Summary */}
        <CardContainer
          p={3}
          spacing={2}
          borderColor="primary.main"
          borderRadius={2}
          bgcolor="primary.main"
          height="fit-content"
        >
          <Stack>
            <Typography variant="body1" fontWeight={500} color="primary.alpha">
              Total Sales
            </Typography>
            <Typography variant="h2" fontWeight={600} color="common.white">
              {formatCurrency(report?.netTotal)}
            </Typography>
          </Stack>

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
                Lubricants Sales
              </Typography>
              <Typography variant="body2" color="primary.alpha">
                {formatCurrency(report?.totalDisposalSales)}
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

            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography variant="body2" color="primary.alpha">
                Shortages
              </Typography>
              <Typography
                variant="body2"
                color={report?.shortages < 0 ? 'warning' : 'primary.alpha'}
              >
                {report?.shortages < 0
                  ? `(${formatNumber(Math.abs(report.shortages))})`
                  : formatNumber(report?.shortages)}
              </Typography>
            </Stack>
          </Stack>
        </CardContainer>

        <Show
          when={isReadOnly}
          fallback={
            <Typography color="info" variant="body2">
              This report is {report.status.toLowerCase()} and can be edited.
            </Typography>
          }
        >
          <Typography color="warning" variant="body2">
            This report has been submitted and cannot be edited.
          </Typography>
        </Show>
      </Stack>

      <Shortcuts reportId={reportId!} isReadOnly={isReadOnly} />
      <EmployeesOnDuty reportId={reportId!} employees={report.employees} isReadOnly={isReadOnly} />
      <Income
        reportId={reportId!}
        income={report.income}
        totalIncome={report.totalIncome}
        isReadOnly={isReadOnly}
      />
      <Expenses
        reportId={reportId!}
        expenses={report.expenses}
        totalExpenses={report.totalExpenses}
        isReadOnly={isReadOnly}
      />
      <Inventory
        reportId={reportId!}
        inventories={report.inventories || []}
        totalInventorySales={report.totalInventorySales || 0}
        isReadOnly={isReadOnly}
      />

      <Show
        when={report.status === ReportStatus.VALIDATED}
        fallback={
          report.status !== ReportStatus.SUBMITTED && (
            <Button
              variant="contained"
              size="large"
              startIcon={<CheckCircleOutline />}
              onClick={handleValidateClick}
              disabled={isValidating}
              fullWidth
            >
              {isValidating ? 'Validating...' : 'Validate Report'}
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

      <CustomModal
        open={showConfirmModal}
        onClose={closeConfirmModal}
        onSubmit={handleValidate}
        title="Validate Report?"
        subheader="Disposals have not been updated. Are you sure you want to validate this report?"
        icon={CheckCircleOutline}
        submitText="Validate"
        cancelText="Cancel"
        loading={isValidating}
      />
    </Stack>
  );
};
