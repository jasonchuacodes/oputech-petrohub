import { Stack, Typography, CircularProgress, Box, Divider, darken } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { CheckCircleOutline, DeleteOutline } from '@mui/icons-material';

import { CardContainer, NoData, CustomModal, Button, Show } from '~/components/ui';
import { useAuthContext } from '~/context/auth/useAuthContext';
import { useDisclosure } from '~/hooks/useDisclosure';
import {
  useGetReportByIdQuery,
  useValidateReportMutation,
  useSubmitReportMutation,
  useDeleteReportMutation,
} from '~/services/report/report.queries';
import { UserRoutes } from '~/routes';
import { ReportStatus } from '~/services/report/report.types';
import theme from '~/theme';
import { formatDate } from '~/utils/date';
import { formatCurrency, formatNumber } from '~/utils/number';
import { parseBackendError } from '~/utils/parseBackendError';
import { pathFor } from '~/utils/pathFor';
import { toTitleCase } from '~/utils/textUtils';

import { Shortcuts } from './Shortcuts';
import { EmployeesOnDuty } from './EmployeesOnDuty';
import { Income } from './Income';
import { Expenses } from './Expenses';
import { Inventory } from './Inventory';
import { MoreDetailsMenu } from './MoreDetailsMenu';

export const Report = () => {
  const { auth } = useAuthContext();
  const { reportId } = useParams<{ reportId: string }>();
  const navigate = useNavigate();

  const tenantId = auth?.tenantId || null;

  const { data: report, isLoading } = useGetReportByIdQuery({
    tenantId: tenantId!,
    reportId: reportId!,
  });

  const disclosure = useDisclosure();
  const deleteDisclosure = useDisclosure();

  const { mutateAsync: validateReport, isPending: isValidating } = useValidateReportMutation();
  const { mutateAsync: submitReport, isPending: isSubmitting } = useSubmitReportMutation();
  const { mutateAsync: deleteReport, isPending: isDeleting } = useDeleteReportMutation();

  const hasDisposalsChanged = (): boolean => {
    if (!report?.disposals || report.disposals.length === 0) return true;
    return report.disposals.some(
      (disposal) => Number(disposal.beforeReading) !== Number(disposal.afterReading),
    );
  };

  const hasEmployeesAssigned = () => {
    return report?.employees && report.employees.length > 0;
  };

  const handleValidateClick = () => {
    const disposalsChanged = hasDisposalsChanged();
    const employeesAssigned = hasEmployeesAssigned();

    if (disposalsChanged && employeesAssigned) {
      handleValidate();
    } else {
      disclosure.onOpen();
    }
  };

  const handleValidate = async () => {
    try {
      await validateReport(reportId!);
      toast.success('Report validated successfully');
      disclosure.onClose();
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

  const isOwner = auth?.id === report.creatorId;
  const isReadOnly = report.status === ReportStatus.SUBMITTED || !isOwner;

  return (
    <Stack p={2} spacing={2}>
      <Stack spacing={1}>
        <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap">
          <Typography variant="body1" color="text.primary" fontWeight={500}>
            {formatDate(new Date(), 'MMMM DD, YYYY')} — {report.shift.name} Shift
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
          <Stack p={3} spacing={2}>
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
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography variant="body2" color="primary.alpha">
                  Lubricants
                </Typography>
                <Typography variant="body2" color="primary.alpha">
                  {formatCurrency(report?.totalInventorySales)}
                </Typography>
              </Stack>

              <Divider sx={{ borderColor: 'primary.light' }} />
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography variant="body2" color="primary.alpha">
                  Total Sales
                </Typography>
                <Typography variant="body2" color="primary.alpha">
                  {formatCurrency(report?.totalSales)}
                </Typography>
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
                  color={report.shortages > 0 ? 'warning' : 'primary.alpha'}
                >
                  {report.shortages > 0
                    ? `(${formatNumber(Math.abs(report.shortages))})`
                    : formatNumber(Math.abs(report.shortages))}
                </Typography>
              </Stack>
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
                {report.creator.name}
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
        </Show>
      </Stack>

      <CustomModal
        open={disclosure.open}
        onClose={disclosure.onClose}
        onSubmit={handleValidate}
        title="Validate Report?"
        subheader={
          !hasDisposalsChanged() && !hasEmployeesAssigned()
            ? 'Disposals have not been updated and no employees are assigned. Are you sure you want to validate this report?'
            : !hasDisposalsChanged()
              ? 'Disposals have not been updated. Are you sure you want to validate this report?'
              : 'No employees are assigned. Are you sure you want to validate this report?'
        }
        icon={CheckCircleOutline}
        submitText="Validate"
        cancelText="Cancel"
        loading={isValidating}
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
