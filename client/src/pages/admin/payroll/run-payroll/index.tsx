import { ErrorOutline, HomeOutlined } from '@mui/icons-material';
import { Stack, Tooltip, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useMemo, useEffect } from 'react';

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
import { getInitialDateRange, getLastCompletedWeek, type WeekPeriod } from '~/utils/date';
import { useGetAllTimesheetsQuery } from '~/services/timesheet/timesheet.queries';
import type { Timesheet } from '~/services/timesheet/timesheet.types';
import { useRunPayrollMutation } from '~/services/payroll/payroll.queries';
import {
  PaymentStatus,
  PayrollPeriodType,
  SalaryRateType,
  type Payslip,
} from '~/services/payroll/payroll.types';

import { MoreDetailsMenu } from './MoreDetailsMenu';

export const RunPayrollPage = () => {
  const { tenantId } = useParams();
  const navigate = useNavigate();
  const defaultWeek = getLastCompletedWeek();
  const initialRange = getInitialDateRange('payrollWeek', {
    start: defaultWeek.start,
    end: defaultWeek.end,
  });
  const [selectedWeek, setSelectedWeek] = useState<WeekPeriod>({
    start: initialRange.startDate,
    end: initialRange.endDate,
  });

  const runPayrollMutation = useRunPayrollMutation();

  const storageKey = useMemo(
    () =>
      `payroll-overrides-${tenantId}-${selectedWeek.start.format('YYYY-MM-DD')}-${selectedWeek.end.format('YYYY-MM-DD')}`,
    [tenantId, selectedWeek],
  );

  const [overrides, setOverrides] = useState<Record<string, { amount: number; notes?: string }>>(
    {},
  );

  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      setOverrides(stored ? JSON.parse(stored) : {});
    } catch {
      setOverrides({});
    }
  }, [storageKey]);

  useEffect(() => {
    if (Object.keys(overrides).length > 0) {
      localStorage.setItem(storageKey, JSON.stringify(overrides));
    }
  }, [overrides, storageKey]);

  useEffect(() => {
    sessionStorage.setItem(
      'payrollWeek',
      JSON.stringify({
        start: selectedWeek.start.utc().toISOString(),
        end: selectedWeek.end.utc().toISOString(),
      }),
    );
  }, [selectedWeek]);

  const handleUpdateCompensation = (userId: string, amount: number, notes?: string) => {
    setOverrides((prev) => ({ ...prev, [userId]: { amount, notes } }));
  };

  const { data: timesheets = [], isLoading } = useGetAllTimesheetsQuery({
    tenantId,
    startDate: selectedWeek.start,
    endDate: selectedWeek.end,
    processed: false,
  });

  const payslipData: Payslip[] = useMemo(() => {
    const grouped = new Map<
      string,
      { timesheets: Timesheet[]; salaryRate: number; rateType: SalaryRateType }
    >();

    for (const ts of timesheets) {
      const uid = ts.user.id;
      if (!grouped.has(uid)) {
        grouped.set(uid, {
          timesheets: [],
          salaryRate: ts.user.salaryRates?.[0]?.rate ?? 0,
          rateType: ts.user.salaryRates?.[0]?.rateType ?? SalaryRateType.DAILY,
        });
      }
      grouped.get(uid)!.timesheets.push(ts);
    }

    return Array.from(grouped.entries()).map(
      ([userId, { timesheets: userTimesheets, salaryRate, rateType }]) => {
        const HOURS_PER_DAY = 8;
        const hourlyRate =
          rateType === SalaryRateType.HOURLY ? salaryRate : salaryRate / HOURS_PER_DAY;
        const totalHours = userTimesheets.reduce((sum, ts) => sum + ts.totalHours, 0);
        const calculatedGross = totalHours * hourlyRate;

        const override = overrides[userId];
        const grossPay = override?.amount ?? calculatedGross;

        return {
          id: userId,
          tenantId: userTimesheets[0].tenantId,
          userId,
          periodType: PayrollPeriodType.WEEKLY,
          periodStart: selectedWeek.start.toISOString(),
          periodEnd: selectedWeek.end.toISOString(),
          totalHours,
          rateSnapshot: salaryRate.toString(),
          rateTypeSnapshot: rateType,
          totalCompensation: grossPay.toString(),
          user: userTimesheets[0].user,
          notes: override?.notes,
          paymentStatus: PaymentStatus.UNPAID,
          createdBy: '',
          createdAt: new Date().toISOString(),
        };
      },
    );
  }, [timesheets, overrides, selectedWeek]);

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
            loading={isLoading}
            collection={DataTable.collection({
              items: payslipData,
              itemToValue: (item) => item.id,
              itemToString: (item) => item.user?.name || 'Unknown',
            })}
            columns={[
              {
                id: 'name',
                heading: 'Name',
                cell: (item) => (
                  <Typography variant="body2" color="text.primary">
                    {item.user?.name || 'Unknown'}
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
                  parseFloat(item.rateSnapshot) === 0 ? (
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
                      {formatCurrency(parseFloat(item.totalCompensation))}
                    </Typography>
                  ),
                orderable: true,
                width: 150,
                summary: (items) => {
                  const total = items.reduce(
                    (sum, item) => sum + parseFloat(item.totalCompensation),
                    0,
                  );
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
                cell: () => (
                  <Typography variant="body2" color="text.secondary">
                    {formatCurrency(0)}
                  </Typography>
                ),
                orderable: true,
                width: 150,
                summary: () => (
                  <Typography variant="body2" color="text.secondary">
                    {formatCurrency(0)}
                  </Typography>
                ),
              },
              {
                id: 'netAmount',
                heading: 'Billable',
                cell: (item) => (
                  <Typography variant="body2" color="text.primary">
                    {formatCurrency(parseFloat(item.totalCompensation))}
                  </Typography>
                ),
                orderable: true,
                width: 150,
                summary: (items) => {
                  const total = items.reduce(
                    (sum, item) => sum + parseFloat(item.totalCompensation),
                    0,
                  );
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
                    <MoreDetailsMenu onUpdateCompensation={handleUpdateCompensation} />
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
        <Button
          variant="outlined"
          onClick={() => {
            setOverrides({});
            localStorage.removeItem(storageKey);
            navigate(-1);
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={async () => {
            try {
              const payslips = payslipData.map((p) => {
                const timesheetIds = timesheets
                  .filter((ts) => ts.user.id === p.userId)
                  .map((ts) => ts.id);
                return {
                  userId: p.userId,
                  timesheetIds,
                  totalHours: p.totalHours,
                  rateSnapshot: p.rateSnapshot,
                  rateTypeSnapshot: p.rateTypeSnapshot as SalaryRateType,
                  totalCompensation: p.totalCompensation,
                  notes: p.notes ?? undefined,
                };
              });

              // Run payroll mutation
              await runPayrollMutation.mutateAsync({
                tenantId: tenantId!,
                periodType: PayrollPeriodType.WEEKLY,
                periodStart: selectedWeek.start.toISOString(),
                periodEnd: selectedWeek.end.toISOString(),
                payslips,
              });

              setOverrides({});
              localStorage.removeItem(storageKey);
              navigate(pathFor({ pathname: AdminRoutes.TenantPayroll, params: { tenantId } }));
            } catch (error) {
              console.error('Failed to run payroll:', error);
            }
          }}
          disabled={payslipData.length === 0 || isLoading || runPayrollMutation.isPending}
        >
          {runPayrollMutation.isPending ? 'Running Payroll...' : 'Run Payroll'}
        </Button>
      </Stack>
    </PageLayout>
  );
};
