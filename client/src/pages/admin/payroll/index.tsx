import { ChevronRightOutlined, HomeOutlined, PlayArrowOutlined } from '@mui/icons-material';
import { Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';

import { PageHeader } from '~/components/layouts';
import { Breadcrumb, Button, Chip, DataTable, PageContainer, PageLayout } from '~/components/ui';
import { AdminRoutes } from '~/routes';
import { formatCurrency } from '~/utils/number';
import { formatRange } from '~/utils/date';
import { pathFor } from '~/utils/pathFor';
import { useGetPayrollRunsQuery } from '~/services/payroll/payroll.queries';
import { getStatusColor, getStatusLabel } from './utils';

export const PayrollPage = () => {
  const { tenantId } = useParams();
  const navigate = useNavigate();

  const { data: payrollRuns = [], isLoading } = useGetPayrollRunsQuery({
    tenantId: tenantId!,
  });

  const payrollRunsWithStats = payrollRuns.map((run) => {
    const billable =
      run.payslips?.reduce((sum: number, p) => sum + parseFloat(p.totalCompensation), 0) || 0;

    return {
      ...run,
      billable,
    };
  });

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
              label: 'Payroll',
            },
          ]}
        />
        <PageHeader
          title="Payroll Management"
          description="Manage and send payslip to your employees here."
          action={
            <Button
              variant="contained"
              startIcon={<PlayArrowOutlined />}
              onClick={() =>
                navigate(
                  pathFor({
                    pathname: AdminRoutes.TenantRunPayroll,
                    params: { tenantId },
                  }),
                )
              }
            >
              Run Payroll
            </Button>
          }
        />
        <DataTable
          id="payroll-table"
          loading={isLoading}
          collection={DataTable.collection({
            items: payrollRunsWithStats,
            itemToValue: (item) => item.id,
            itemToString: (item) => formatRange(dayjs(item.periodStart), dayjs(item.periodEnd)),
          })}
          columns={[
            {
              id: 'period',
              heading: 'Payroll Period',
              cell: (item) => (
                <Typography variant="body2" color="text.primary">
                  {formatRange(dayjs(item.periodStart), dayjs(item.periodEnd))}
                </Typography>
              ),
              orderable: true,
              width: 240,
            },
            {
              id: 'status',
              heading: 'Status',
              cell: (item) => (
                <Chip
                  label={getStatusLabel(item.status)}
                  color={getStatusColor(item.status)}
                  sx={{ textTransform: 'capitalize' }}
                />
              ),
              width: 160,
            },
            {
              id: 'billable',
              heading: 'Billable',
              cell: (item) => (
                <Typography variant="body2" color="text.secondary">
                  {formatCurrency(item.billable)}
                </Typography>
              ),
              orderable: true,
              width: 160,
            },
            {
              id: 'actions',
              heading: '',
              align: 'right',
              cell: () => (
                <ChevronRightOutlined
                  fontSize="small"
                  sx={{
                    color: 'text.secondary',
                    opacity: 0.6,
                  }}
                />
              ),
              width: 50,
            },
          ]}
          onRowClick={(item) =>
            navigate(
              pathFor({
                pathname: AdminRoutes.TenantPayrollRunDetail,
                params: { tenantId, payrollRunId: item.id },
              }),
            )
          }
          emptyMessage="No payroll runs yet. Click 'Run Payroll' to create your first payroll run."
          dateRange={{
            enabled: true,
            defaultStartValue: dayjs().startOf('month'),
            defaultEndValue: dayjs().endOf('month'),
            label: 'Filter by period',
          }}
        />
      </PageContainer>
    </PageLayout>
  );
};
