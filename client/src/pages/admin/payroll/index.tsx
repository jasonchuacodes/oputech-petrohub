import { HomeOutlined, PlayArrowOutlined } from '@mui/icons-material';
import { Stack, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import dayjs from 'dayjs';

import { PageHeader } from '~/components/layouts';
import { Breadcrumb, Button, Chip, DataTable, PageContainer, PageLayout } from '~/components/ui';
import { AdminRoutes } from '~/routes';
import { formatCurrency } from '~/utils/number';
import { formatRange } from '~/utils/date';
import { pathFor } from '~/utils/pathFor';

type PayrollData = {
  id: string;
  startDate: string;
  endDate: string;
  status: 'pending' | 'paid';
  billable: number;
};

const mockPayrollData: PayrollData[] = [
  {
    id: '1',
    startDate: '2026-01-01T00:00:00.000Z',
    endDate: '2026-01-07T23:59:59.999Z',
    status: 'pending',
    billable: 45000,
  },
  {
    id: '2',
    startDate: '2026-01-08T00:00:00.000Z',
    endDate: '2026-01-15T23:59:59.999Z',
    status: 'paid',
    billable: 89500,
  },
  {
    id: '3',
    startDate: '2026-01-16T00:00:00.000Z',
    endDate: '2026-01-22T23:59:59.999Z',
    status: 'paid',
    billable: 52300,
  },
  {
    id: '4',
    startDate: '2026-01-23T00:00:00.000Z',
    endDate: '2026-01-31T23:59:59.999Z',
    status: 'paid',
    billable: 67800,
  },
  {
    id: '5',
    startDate: '2025-12-16T00:00:00.000Z',
    endDate: '2025-12-22T23:59:59.999Z',
    status: 'paid',
    billable: 48200,
  },
  {
    id: '6',
    startDate: '2025-12-23T00:00:00.000Z',
    endDate: '2025-12-31T23:59:59.999Z',
    status: 'paid',
    billable: 71500,
  },
];

export const PayrollPage = () => {
  const { tenantId } = useParams();

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
        />

        {/* Run Payroll CTA Section */}
        <Stack
          direction="row"
          bgcolor="background.paper"
          p={2}
          spacing={3}
          borderRadius={2}
          alignItems="start"
          justifyContent="space-between"
        >
          <Stack spacing={2}>
            <Typography variant="body1" fontWeight={600}>
              Ready to Run Payroll
            </Typography>
            <Stack spacing={1}>
              <Stack direction="row" spacing={2}>
                <Typography variant="body2" color="text.secondary">
                  Period:
                </Typography>
                <Typography variant="body2" color="text.primary">
                  {/* Period */}
                  February 1 - February 7, 2026
                </Typography>
              </Stack>
              <Stack direction="row" spacing={2}>
                <Typography variant="body2" color="text.secondary">
                  Estimated Cost:
                </Typography>
                <Typography variant="body2" color="text.primary">
                  {formatCurrency(24500)}
                </Typography>
              </Stack>
            </Stack>
          </Stack>
          <Button
            size="large"
            variant="contained"
            startIcon={<PlayArrowOutlined />}
            onClick={() => console.log('handle run payroll')}
          >
            Run Payroll
          </Button>
        </Stack>
        <DataTable
          id="payroll-table"
          collection={DataTable.collection({
            items: mockPayrollData,
            itemToValue: (item) => item.id,
            itemToString: (item) => formatRange(dayjs(item.startDate), dayjs(item.endDate)),
          })}
          columns={[
            {
              id: 'period',
              heading: 'Payroll Period',
              cell: (item) => (
                <Typography variant="body2" color="text.primary">
                  {formatRange(dayjs(item.startDate), dayjs(item.endDate))}
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
                  label={item.status}
                  color={item.status === 'paid' ? 'success' : 'warning'}
                  sx={{ textTransform: 'capitalize' }}
                />
              ),
              orderable: true,
              width: 120,
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
              width: 150,
            },
            {
              id: 'actions',
              heading: 'Actions',
              cell: () => <Button variant="text">View</Button>,
              width: 100,
            },
          ]}
          emptyMessage="No payroll data available."
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
