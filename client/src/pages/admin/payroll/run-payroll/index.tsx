import { ErrorOutline, HomeOutlined } from '@mui/icons-material';
import { Stack, Tooltip, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';

import { PageHeader } from '~/components/layouts';
import {
  Breadcrumb,
  Button,
  DataTable,
  PageContainer,
  PageLayout,
  WeekPicker,
} from '~/components/ui';
import { PayslipProvider } from '~/context/payroll/PayslipContext';
import { AdminRoutes } from '~/routes';
import { formatCurrency, formatNumber } from '~/utils/number';
import { pathFor } from '~/utils/pathFor';
import { getLastCompletedWeek, type WeekPeriod } from '~/utils/date';

import { MoreDetailsMenu } from './MoreDetailsMenu';

type DeductionItem = {
  name: string;
  amount: number;
};

type PayslipData = {
  id: string;
  name: string;
  position: string | null;
  salaryRate: number;
  totalHours: number;
  overtime: number;
  grossPay: number;
  deductions: DeductionItem[];
  totalDeductions: number;
  netAmount: number;
};

const mockPayslipData: PayslipData[] = [
  {
    id: '1',
    name: 'John Doe',
    position: 'Software Engineer',
    salaryRate: 625,
    totalHours: 40,
    overtime: 0,
    grossPay: 25000,
    deductions: [
      { name: 'SSS Contribution', amount: 1125 },
      { name: 'PhilHealth', amount: 625 },
      { name: 'Pag-IBIG', amount: 500 },
      { name: 'Tax (Withholding)', amount: 250 },
    ],
    totalDeductions: 2500,
    netAmount: 22500,
  },
  {
    id: '2',
    name: 'Jane Smith',
    position: 'Project Manager',
    salaryRate: 625,
    totalHours: 38,
    overtime: 0,
    grossPay: 23750,
    deductions: [
      { name: 'SSS Contribution', amount: 1068.75 },
      { name: 'PhilHealth', amount: 593.75 },
      { name: 'Pag-IBIG', amount: 475 },
      { name: 'Tax (Withholding)', amount: 237.5 },
    ],
    totalDeductions: 2375,
    netAmount: 21375,
  },
  {
    id: '3',
    name: 'Bob Johnson',
    position: null,
    salaryRate: 0,
    totalHours: 42,
    overtime: 0,
    grossPay: 0,
    deductions: [],
    totalDeductions: 0,
    netAmount: 0,
  },
];

export const RunPayrollPage = () => {
  const { tenantId } = useParams();
  const navigate = useNavigate();
  const [selectedWeek, setSelectedWeek] = useState<WeekPeriod>(() => getLastCompletedWeek());

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

        <Stack spacing={3}>
          <WeekPicker
            label="Payroll Period"
            selectedStart={selectedWeek.start}
            selectedEnd={selectedWeek.end}
            onAccept={(week) => setSelectedWeek(week)}
          />

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
                cell: (item) =>
                  !item.salaryRate ? (
                    <Tooltip title="Please set the user salary rate in the user detail page.">
                      <Stack
                        direction="row"
                        spacing={0.5}
                        alignItems="center"
                        justifyContent="center"
                        px={1}
                        py={0.5}
                        border="1px solid"
                        borderColor="divider"
                        borderRadius={4}
                        width="fit-content"
                      >
                        <ErrorOutline fontSize="small" color="disabled" />
                        <Typography variant="caption" color="text.secondary">
                          Rate not set
                        </Typography>
                      </Stack>
                    </Tooltip>
                  ) : (
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
                    {formatCurrency(item.totalDeductions)}
                  </Typography>
                ),
                orderable: true,
                width: 150,
                summary: (items) => {
                  const total = items.reduce((sum, item) => sum + item.totalDeductions, 0);
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
                  <PayslipProvider payslipId={item.id} payslip={item}>
                    <MoreDetailsMenu />
                  </PayslipProvider>
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
        </Stack>
      </PageContainer>
      <Stack
        py={2}
        px={3}
        width="100%"
        bgcolor="background.paper"
        direction="row"
        spacing={1}
        justifyContent="end"
        sx={{
          position: 'sticky',
          bottom: 0,
          zIndex: 10,
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Button variant="outlined" onClick={() => navigate(-1)}>
          Cancel
        </Button>
        <Button variant="contained" onClick={() => console.log('Run Payroll clicked')}>
          Run Payroll
        </Button>
      </Stack>
    </PageLayout>
  );
};
