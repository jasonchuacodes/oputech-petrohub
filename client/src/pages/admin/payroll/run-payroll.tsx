import { HomeOutlined } from '@mui/icons-material';
import { Stack, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';

import { PageHeader } from '~/components/layouts';
import { Breadcrumb, DataTable, PageContainer, PageLayout } from '~/components/ui';
import { AdminRoutes } from '~/routes';
import { formatCurrency, formatNumber } from '~/utils/number';
import { pathFor } from '~/utils/pathFor';

import { MoreDetailsMenu } from './MoreDetailsMenu';

type PayslipData = {
  id: string;
  name: string;
  totalHours: number;
  grossPay: number;
  deductions: number;
  netAmount: number;
};

const mockPayslipData: PayslipData[] = [
  {
    id: '1',
    name: 'John Doe',
    totalHours: 40,
    grossPay: 25000,
    deductions: 2500,
    netAmount: 22500,
  },
  {
    id: '2',
    name: 'Jane Smith',
    totalHours: 38,
    grossPay: 23750,
    deductions: 2375,
    netAmount: 21375,
  },
  {
    id: '3',
    name: 'Bob Johnson',
    totalHours: 42,
    grossPay: 26250,
    deductions: 2625,
    netAmount: 23625,
  },
];

export const RunPayrollPage = () => {
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
              to: pathFor({
                pathname: AdminRoutes.TenantPayroll,
                params: { tenantId },
              }),
            },
            {
              label: 'Run Payroll',
            },
          ]}
        />
        <PageHeader
          title="Review Payroll"
          description="Review payroll details and and generate payrolls."
        />

        <Stack direction="row" spacing={2} mb={3} bgcolor="background.paper" borderRadius={2} p={2}>
          <Typography variant="body1" color="text.secondary">
            Period:
          </Typography>
          <Typography variant="body1" color="text.primary">
            February 1 - February 7, 2026
          </Typography>
        </Stack>

        <DataTable
          id="payslips-table"
          collection={DataTable.collection({
            items: mockPayslipData,
            itemToValue: (item) => item.id,
            itemToString: (item) => item.name,
          })}
          columns={[
            {
              id: 'name',
              heading: 'Name',
              cell: (item) => (
                <Typography variant="body2" color="text.primary">
                  {item.name}
                </Typography>
              ),
              orderable: true,
              width: 200,
              summary: () => (
                <Typography variant="body2" color="text.primary">
                  Totals
                </Typography>
              ),
            },
            {
              id: 'totalHours',
              heading: 'Total Hours',
              cell: (item) => (
                <Typography variant="body2" color="text.secondary">
                  {formatNumber(item.totalHours, 2)} hrs
                </Typography>
              ),
              orderable: true,
              width: 120,
              summary: (items) => {
                const total = items.reduce((sum, item) => sum + item.totalHours, 0);
                return (
                  <Typography variant="body2" color="text.secondary">
                    {formatNumber(total, 2)} hrs
                  </Typography>
                );
              },
            },
            {
              id: 'grossPay',
              heading: 'Gross Pay',
              cell: (item) => (
                <Typography variant="body2" color="text.secondary">
                  {formatCurrency(item.grossPay)}
                </Typography>
              ),
              orderable: true,
              width: 150,
              summary: (items) => {
                const total = items.reduce((sum, item) => sum + item.grossPay, 0);
                return (
                  <Typography variant="body2" color="text.secondary">
                    {formatCurrency(total)}
                  </Typography>
                );
              },
            },
            {
              id: 'deductions',
              heading: 'Deductions',
              cell: (item) => (
                <Typography variant="body2" color="text.secondary">
                  {formatCurrency(item.deductions)}
                </Typography>
              ),
              orderable: true,
              width: 150,
              summary: (items) => {
                const total = items.reduce((sum, item) => sum + item.deductions, 0);
                return (
                  <Typography variant="body2" color="text.secondary">
                    {formatCurrency(total)}
                  </Typography>
                );
              },
            },
            {
              id: 'netAmount',
              heading: 'Billable',
              cell: (item) => (
                <Typography variant="body2" color="text.primary">
                  {formatCurrency(item.netAmount)}
                </Typography>
              ),
              orderable: true,
              width: 150,
              summary: (items) => {
                const total = items.reduce((sum, item) => sum + item.netAmount, 0);
                return (
                  <Typography variant="body2" color="text.primary">
                    {formatCurrency(total)}
                  </Typography>
                );
              },
            },
            {
              id: 'actions',
              align: 'right',
              heading: '',
              cell: (item) => (
                <MoreDetailsMenu
                  payslipId={item.id}
                  onView={() => console.log('view', item.id)}
                  onEdit={() => console.log('edit', item.id)}
                  onDelete={() => console.log('delete', item.id)}
                />
              ),
              width: 100,
            },
          ]}
          search={{
            enabled: true,
            placeholder: 'Search user',
          }}
          emptyMessage="No payslips to generate."
        />
      </PageContainer>
    </PageLayout>
  );
};
