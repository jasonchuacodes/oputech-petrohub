import { DeleteOutline, HomeOutlined, MoreHorizOutlined } from '@mui/icons-material';
import { Avatar, Box, Divider, IconButton, Stack, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

import {
  Breadcrumb,
  Button,
  CardContainer,
  CustomModal,
  LoadingSpinner,
  NoData,
  PageContainer,
  PageLayout,
  Show,
} from '~/components/ui';
import { useTenantContext } from '~/context/tenant/useTenantContext';
import { useDisclosure } from '~/hooks/useDisclosure';
import { PageHeader } from '~/components/layouts';
import { AdminRoutes } from '~/routes';
import {
  useDeleteReportMutation,
  useGetReportByIdQuery,
} from '~/services/report/report.queries';
import { formatDate, formatTime } from '~/utils/date';
import { formatCurrency, formatNumber } from '~/utils/number';
import { parseBackendError } from '~/utils/parseBackendError';
import { pathFor } from '~/utils/pathFor';

export const ReportDetailPage = () => {
  const { tenantId } = useTenantContext();
  const { reportId } = useParams<{ reportId: string }>();
  const navigate = useNavigate();

  const { data: report, isLoading } = useGetReportByIdQuery({ tenantId, reportId: reportId! });
  const { mutateAsync: deleteReport, isPending: isDeleting } = useDeleteReportMutation();
  const deleteDisclosure = useDisclosure();

  const handleDelete = async () => {
    try {
      await deleteReport(reportId!);
      toast.success('Report deleted successfully');
      navigate(pathFor({ pathname: AdminRoutes.TenantReports, params: { tenantId } }));
    } catch (err) {
      const message = parseBackendError(err);
      toast.error(message);
    } finally {
      deleteDisclosure.onClose();
    }
  };

  return (
    <PageLayout>
      <PageContainer>
        <Breadcrumb
          items={[
            {
              icon: HomeOutlined,
              label: 'Home',
              to: pathFor({
                pathname: AdminRoutes.TenantHome,
                params: { tenantId },
              }),
            },
            {
              label: 'Reports',
              to: pathFor({
                pathname: AdminRoutes.TenantReports,
                params: { tenantId },
              }),
            },
            {
              label: 'Report',
            },
          ]}
        />
        <PageHeader
          title="Report Details"
          description="View the detailed financial report of the shift here."
          action={
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteOutline />}
              onClick={deleteDisclosure.onOpen}
            >
              Delete
            </Button>
          }
        />

        {isLoading ? (
          <Box display="flex" justifyContent="center" alignItems="center" pt={10}>
            <LoadingSpinner />
          </Box>
        ) : (
          <Stack spacing={2}>
            {report && (
              <CardContainer height="fit-content" spacing={2}>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  {formatDate(report.shiftDate, 'MMMM DD, YYYY')}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  <Typography variant="body2" color="text.secondary">
                    {report.shift.name} Shift ({formatTime(report.periodStart)} -{' '}
                    {formatTime(report.periodEnd)})
                  </Typography>
                </Typography>
              </CardContainer>
            )}
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <Stack flex={1} spacing={2}>
                <CardContainer height="fit-content" p={2} spacing={2} borderRadius={2}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body1" fontWeight={500} color="text.primary">
                      Net Sales
                    </Typography>
                    <Typography variant="h2" fontWeight={600} color="primary.main">
                      {formatCurrency(Number(report?.netTotal))}
                    </Typography>
                  </Stack>

                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      Lubricants
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {formatCurrency(Number(report?.totalInventorySales))}
                    </Typography>
                  </Stack>
                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      Fuel Sales
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {formatCurrency(Number(report?.totalSales))}
                    </Typography>
                  </Stack>
                  <Divider />

                  <Stack pl={2} spacing={1}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">
                        Sales
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {formatCurrency(Number(report?.totalIncome))}
                      </Typography>
                    </Stack>

                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">
                        Expenses
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {formatCurrency(Number(report?.totalExpenses))}
                      </Typography>
                    </Stack>

                    <Divider />

                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">
                        Disposals
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {formatCurrency(Number(report?.totalDisposalSales))}
                      </Typography>
                    </Stack>

                    <Divider />
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                      <Typography variant="body2" color="text.primary">
                        {(report?.shortages ?? 0) >= 0 ? 'Shortages ' : 'Over'}
                      </Typography>
                      <Typography
                        variant="body2"
                        color={(report?.shortages ?? 0) > 0 ? 'warning' : 'text.primary'}
                      >
                        {(report?.shortages ?? 0) > 0
                          ? `(${formatNumber(Math.abs(report?.shortages ?? 0))})`
                          : formatNumber(Math.abs(report?.shortages ?? 0))}
                      </Typography>
                    </Stack>
                  </Stack>
                </CardContainer>

                {/* Income */}
                <CardContainer height="fit-content" spacing={1}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Income
                    </Typography>
                    <IconButton onClick={() => null} size="small">
                      <MoreHorizOutlined fontSize="inherit" />
                    </IconButton>
                  </Stack>

                  {report?.income.map((income) => (
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">
                        {income.description ?? 'Cash'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {income.amount && formatNumber(Number(income.amount))}
                      </Typography>
                    </Stack>
                  ))}

                  <Divider />
                  <Stack spacing={1}>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">
                        Total
                      </Typography>
                      <Typography variant="body2" color="text.primary">
                        {formatCurrency(Number(report?.totalIncome))}
                      </Typography>
                    </Stack>
                  </Stack>
                </CardContainer>

                {/* Expenses */}
                <CardContainer height="fit-content" spacing={1}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Expenses
                    </Typography>
                    <IconButton onClick={() => null} size="small">
                      <MoreHorizOutlined fontSize="inherit" />
                    </IconButton>
                  </Stack>
                  {report?.expenses.map((expense) => (
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">
                        {expense.description ?? 'Cash'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {expense.amount && formatNumber(Number(expense.amount))}
                      </Typography>
                    </Stack>
                  ))}
                  <Divider />
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      Total
                    </Typography>
                    <Typography variant="body2" color="text.primary">
                      {formatCurrency(Number(report?.totalExpenses))}
                    </Typography>
                  </Stack>
                </CardContainer>

                {/* Lubricants */}
                <CardContainer height="fit-content" spacing={1}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Lubricants
                    </Typography>
                    <IconButton onClick={() => null} size="small">
                      <MoreHorizOutlined fontSize="inherit" />
                    </IconButton>
                  </Stack>

                  {/* Header */}
                  <Stack direction="row" alignItems="center">
                    <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>
                      Name
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ width: 80, textAlign: 'right' }}
                    >
                      Quantity
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ width: 100, textAlign: 'right' }}
                    >
                      Amount
                    </Typography>
                  </Stack>

                  {/* Data Rows */}
                  {report?.inventories.map((item) => (
                    <Stack key={item.id} direction="row" alignItems="center" spacing={1}>
                      <Typography variant="body2" sx={{ flex: 1 }}>
                        {item.product.name}
                      </Typography>
                      <Typography variant="body2" sx={{ width: 80, textAlign: 'right' }}>
                        {formatNumber(item.quantity, 0)}
                      </Typography>
                      <Typography variant="body2" sx={{ width: 100, textAlign: 'right' }}>
                        {formatNumber(item.amount, 2)}
                      </Typography>
                    </Stack>
                  ))}
                  <Divider />
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      Total
                    </Typography>
                    <Typography variant="body2" color="text.primary">
                      {formatCurrency(Number(report?.totalInventorySales))}
                    </Typography>
                  </Stack>
                </CardContainer>
              </Stack>

              {/* Right Section */}
              <Stack sx={{ minWidth: { md: '40%' } }} spacing={2}>
                <CardContainer height="fit-content" spacing={2}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      On Duty
                    </Typography>
                    <IconButton onClick={() => null} size="small">
                      <MoreHorizOutlined fontSize="inherit" />
                    </IconButton>
                  </Stack>
                  {report?.employees.length === 0 ? (
                    <NoData text="No employees on duty" description="" />
                  ) : (
                    <Stack direction="row" spacing={3} px={2} flexWrap="wrap">
                      {report?.employees.map(({ user }) => (
                        <Stack alignItems="center">
                          <Avatar sx={{ height: 40, width: 40 }}></Avatar>
                          <Typography variant="body2" color="text.primary">
                            {user?.name.split(' ')[0]}
                          </Typography>
                        </Stack>
                      ))}
                    </Stack>
                  )}
                </CardContainer>

                {/* Disposals */}
                <CardContainer height="fit-content" spacing={2}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Disposals
                    </Typography>
                    <IconButton onClick={() => null} size="small">
                      <MoreHorizOutlined fontSize="inherit" />
                    </IconButton>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      Calculated Sales
                    </Typography>
                    <Typography variant="body1" color="text.primary">
                      {formatCurrency(report?.totalDisposalSales || 0)}
                    </Typography>
                  </Stack>

                  {/* Summary */}
                  <Show when={!!report?.disposals?.length}>
                    <Divider />
                    {report?.disposals.map((disposal) => (
                      <Stack
                        key={disposal.id}
                        direction="row"
                        justifyContent="space-between"
                        pl={2}
                      >
                        <Typography variant="body2" color="text.secondary">
                          {disposal.product.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {formatCurrency(Number(disposal.totalSales))}
                        </Typography>
                      </Stack>
                    ))}
                  </Show>

                  {/* Disposal Card */}

                  {report?.disposals.map((disposal) => (
                    <CardContainer key={disposal.id} bgcolor="background.default">
                      <Stack direction="row" justifyContent="space-between" alignItems="start">
                        <Stack spacing={1} width="100%">
                          <Typography variant="h6">{disposal.product.name}</Typography>
                          <Stack
                            direction="row"
                            spacing={1}
                            justifyContent="space-between"
                            alignItems="center"
                          >
                            <Typography variant="body2" color="text.secondary">
                              Before Reading
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {disposal.beforeReading}
                            </Typography>
                          </Stack>
                          <Stack
                            direction="row"
                            spacing={1}
                            justifyContent="space-between"
                            alignItems="center"
                          >
                            <Typography variant="body2" color="text.secondary">
                              After Reading
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {disposal.afterReading}
                            </Typography>
                          </Stack>
                          <Divider />
                          <Stack
                            direction="row"
                            spacing={1}
                            justifyContent="space-between"
                            alignItems="center"
                          >
                            <Typography variant="body2" color="text.secondary">
                              Net Disposal
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {disposal.netDisposal}
                            </Typography>
                          </Stack>
                          <Stack
                            direction="row"
                            spacing={1}
                            justifyContent="space-between"
                            alignItems="center"
                          >
                            <Typography variant="body2" color="text.secondary">
                              Price
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {formatCurrency(Number(disposal.priceSnapshot))}
                            </Typography>
                          </Stack>
                          <Divider />
                          <Stack
                            direction="row"
                            spacing={1}
                            justifyContent="space-between"
                            alignItems="center"
                          >
                            <Typography variant="body2" color="text.secondary">
                              Sales
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {formatCurrency(Number(disposal.totalSales))}
                            </Typography>
                          </Stack>
                        </Stack>
                      </Stack>
                    </CardContainer>
                  ))}
                </CardContainer>
              </Stack>
            </Stack>
          </Stack>
        )}
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
      </PageContainer>
    </PageLayout>
  );
};
