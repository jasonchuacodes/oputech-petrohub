import { HomeOutlined, MoreHorizOutlined } from '@mui/icons-material';
import { Avatar, Box, Divider, IconButton, Stack, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';

import {
  Breadcrumb,
  CardContainer,
  LoadingSpinner,
  PageContainer,
  PageLayout,
} from '~/components/ui';
import { useTenantContext } from '~/context/tenant/useTenantContext';
import { PageHeader } from '~/components/layouts';
import { AdminRoutes } from '~/routes';
import { useGetReportByIdQuery } from '~/services/report/report.queries';
import { formatDate } from '~/utils/date';
import { formatCurrency, formatNumber } from '~/utils/number';
import { pathFor } from '~/utils/pathFor';

export const ReportDetailPage = () => {
  const { tenantId } = useTenantContext();
  const { reportId } = useParams<{ reportId: string }>();

  const { data: report, isLoading } = useGetReportByIdQuery({ tenantId, reportId: reportId! });

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
        />

        {isLoading ? (
          <Box display="flex" justifyContent="center" alignItems="center" pt={10}>
            <LoadingSpinner />
          </Box>
        ) : (
          <Stack spacing={2}>
            {report && (
              <CardContainer height="fit-content">
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  {formatDate(report.shiftDate, 'MMMM DD, YYYY')} — {report.shift.name}
                </Typography>
              </CardContainer>
            )}
            <Stack direction="row" spacing={2}>
              <Stack flex={1} spacing={2}>
                <CardContainer height="fit-content">
                  <Stack spacing={1}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                      <Typography variant="h6" color="text.primary">
                        Total Sales
                      </Typography>
                      <Typography variant="h4" fontWeight="medium" color="text.primary">
                        {formatCurrency(Number(report?.netTotal))}
                      </Typography>
                    </Stack>

                    <Stack spacing={1}>
                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2" color="text.secondary">
                          Income
                        </Typography>
                        <Typography variant="body2" color="text.primary">
                          {formatNumber(Number(report?.totalIncome))}
                        </Typography>
                      </Stack>
                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2" color="text.secondary">
                          Expenses
                        </Typography>
                        <Typography variant="body2" color="text.primary">
                          {formatNumber(Number(report?.totalExpenses))}
                        </Typography>
                      </Stack>
                    </Stack>

                    <Divider />
                    
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">
                        Shortages
                      </Typography>
                      <Typography
                        variant="body2"
                        color={(report?.shortages ?? 0) >= 0 ? 'error.main' : 'success.main'}
                      >
                        {(report?.shortages ?? 0) >= 0
                          ? `(${formatCurrency(Math.abs(report?.shortages ?? 0))})`
                          : `${formatCurrency(Math.abs(report?.shortages ?? 0))} over`}
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
              </Stack>

              {/* Right Section */}
              <Stack minWidth="40%" spacing={2}>
                <CardContainer height="fit-content" spacing={2}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      On Duty
                    </Typography>
                    <IconButton onClick={() => null} size="small">
                      <MoreHorizOutlined fontSize="inherit" />
                    </IconButton>
                  </Stack>
                  <Stack direction="row" spacing={3} px={2}>
                    {report?.employees.map(({ user }) => (
                      <Stack alignItems="center">
                        <Avatar sx={{ height: 40, width: 40 }}></Avatar>
                        <Typography variant="body2" color="text.primary">
                          {user?.name.split(' ')[0]}
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>
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
                  <Divider />

                  {/* Summary */}
                  {report?.disposals.map((disposal) => (
                    <Stack key={disposal.id} direction="row" justifyContent="space-between" pl={2}>
                      <Typography variant="body2" color="text.secondary">
                        {disposal.product.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {formatCurrency(Number(disposal.totalSales))}
                      </Typography>
                    </Stack>
                  ))}

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
      </PageContainer>
    </PageLayout>
  );
};
