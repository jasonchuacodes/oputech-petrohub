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
import { formatNumber } from '~/utils/number';
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
              label: 'Report Details',
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
          <Stack direction="row" spacing={2}>
            <Stack flex={1} spacing={2}>
              <CardContainer height="fit-content">
                {report && (
                  <Typography variant="h5" pb={2} sx={{ fontWeight: 600 }}>
                    {formatDate(report?.shiftDate, 'MMMM DD, YYYY')} — {report?.shift.name}
                  </Typography>
                )}
                <Stack spacing={2}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      Net Sales
                    </Typography>
                    <Typography variant="h4" fontWeight="medium" color="text.primary">
                      ₱{formatNumber(Number(report?.netTotal))}
                    </Typography>
                  </Stack>
                  <Divider />
                  <Stack pl={3} spacing={1}>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">
                        Sales
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
                </Stack>
              </CardContainer>

              {/* Income */}
              <CardContainer height="fit-content" spacing={2}>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Income
                  </Typography>
                  <IconButton onClick={() => null} size="small">
                    <MoreHorizOutlined fontSize="inherit" />
                  </IconButton>
                </Stack>
                <Stack spacing={1}>
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
                </Stack>
                <Divider />
                <Stack spacing={1}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      Total
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {formatNumber(Number(report?.totalIncome))}
                    </Typography>
                  </Stack>
                </Stack>
              </CardContainer>

              {/* Expenses */}
              <CardContainer height="fit-content" spacing={2}>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Expenses
                  </Typography>
                  <IconButton onClick={() => null} size="small">
                    <MoreHorizOutlined fontSize="inherit" />
                  </IconButton>
                </Stack>
                <Stack spacing={1}>
                  {report?.expenses.map((expense) => (
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">
                        {expense.description ?? 'Cash'}
                      </Typography>
                      <Typography variant="body2" color="text.primary">
                        {expense.amount && formatNumber(Number(expense.amount))}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
                <Divider />
                <Stack spacing={1}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      Total
                    </Typography>
                    <Typography variant="body2" color="text.primary">
                      {formatNumber(Number(report?.totalExpenses))}
                    </Typography>
                  </Stack>
                </Stack>
              </CardContainer>
            </Stack>

            {/* Right Section */}
            <Stack minWidth="30%" spacing={2}>
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
            </Stack>
          </Stack>
        )}
      </PageContainer>
    </PageLayout>
  );
};
