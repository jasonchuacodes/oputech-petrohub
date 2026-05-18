import { HomeOutlined } from '@mui/icons-material';
import { Stack, Typography, Alert } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useMemo } from 'react';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';

import { PageHeader } from '~/components/layouts';
import { Breadcrumb, Chip, DataTable, PageContainer, PageLayout } from '~/components/ui';
import { PayslipProvider } from '~/context/payroll/PayslipContext';
import { AdminRoutes } from '~/routes';
import { formatCurrency } from '~/utils/number';
import { formatRange } from '~/utils/date';
import { pathFor } from '~/utils/pathFor';
import {
  useGetPayrollRunByIdQuery,
  useMarkPayslipAsPaidMutation,
  useCancelPayrollRunMutation,
} from '~/services/payroll/payroll.queries';
import { PayrollRunStatus, PaymentStatus, type Payslip } from '~/services/payroll/payroll.types';
import { toTitleCase } from '~/utils/textUtils';
import { parseBackendError } from '~/utils/parseBackendError';

import { SummaryCard } from './SummaryCard';
import { getStatusColor, getStatusLabel, getPaymentStatusColor } from '../utils';
import { PayslipActions } from './PayslipActions';
import { MoreDetailsMenu } from './MoreDetailsMenu';
import { ViewPayslipModal } from '../ViewPayslipModal';

export const PayrollRunDetailPage = () => {
  const { tenantId, payrollRunId } = useParams();
  const navigate = useNavigate();

  const [payslip, setPayslip] = useState<Payslip | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const { data: payrollRun, isLoading } = useGetPayrollRunByIdQuery(payrollRunId);
  const markAsPaidMutation = useMarkPayslipAsPaidMutation();
  const cancelRunMutation = useCancelPayrollRunMutation();

  const handleMarkAsPaid = async (payslipId: string) => {
    try {
      const updated = await markAsPaidMutation.mutateAsync({
        payslipId,
        paidAt: new Date().toISOString(),
        paymentMethod: 'bank_transfer',
      });
      setPayslip(updated);
    } catch (error) {
      console.error('Failed to mark payslip as paid:', error);
    }
  };

  const handleCancelRun = async () => {
    if (!payrollRunId) return;

    try {
      await cancelRunMutation.mutateAsync(payrollRunId);
      toast.success('Payroll run cancelled successfully');
      navigate(pathFor({ pathname: AdminRoutes.TenantPayroll, params: { tenantId } }));
    } catch (error) {
      const errorMessage = parseBackendError(error);
      toast.error(`Failed to cancel payroll run: ${errorMessage}`);
    }
  };

  const totalPayslips = payrollRun?.payslips?.length || 0;
  const paidPayslips =
    payrollRun?.payslips?.filter((p) => p.paymentStatus === PaymentStatus.PAID).length || 0;
  const totalCompensation =
    payrollRun?.payslips?.reduce((sum, p) => sum + parseFloat(p.totalCompensation), 0) || 0;

  const filteredPayslips: Payslip[] = useMemo(() => {
    const payslips: Payslip[] = payrollRun?.payslips || [];
    const trimmed = searchTerm.trim().toLowerCase();
    if (!trimmed) return payslips;
    return payslips.filter((p) =>
      (p.user?.name || p.userId).toLowerCase().includes(trimmed)
    );
  }, [payrollRun?.payslips, searchTerm]);

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
              label: 'Payroll Detail',
            },
          ]}
        />

        {payrollRun && (
          <>
            <PageHeader
              title="Payroll Detail"
              description="View the full details and breakdown of this payroll run."
              action={
                payrollRun.status === PayrollRunStatus.PENDING && (
                  <MoreDetailsMenu
                    onConfirm={handleCancelRun}
                    loading={cancelRunMutation.isPending}
                    periodStart={payrollRun.periodStart}
                    periodEnd={payrollRun.periodEnd}
                  />
                )
              }
            />

            {/* Summary Section */}
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={0.5}>
              <SummaryCard label="Period">
                <Typography variant="h6" color="text.primary" fontWeight={600}>
                  {formatRange(dayjs(payrollRun.periodStart), dayjs(payrollRun.periodEnd))}
                </Typography>
              </SummaryCard>
              <SummaryCard label="Total Cost">
                <Typography variant="h6" color="text.primary" fontWeight={600}>
                  {formatCurrency(totalCompensation)}
                </Typography>
              </SummaryCard>
              <SummaryCard label="Status">
                <Typography variant="h6" color={getStatusColor(payrollRun.status)} fontWeight={600}>
                  {getStatusLabel(payrollRun.status)}
                </Typography>
              </SummaryCard>
              <SummaryCard label="Payslips">
                <Typography variant="h6" color="text.primary" fontWeight={600}>
                  {paidPayslips}/{totalPayslips} paid
                </Typography>
              </SummaryCard>
            </Stack>

            {payrollRun.notes && (
              <Alert severity="info">
                <Typography variant="body2">
                  <strong>Notes:</strong> {payrollRun.notes}
                </Typography>
              </Alert>
            )}

            {/* Payslips Table */}
            <DataTable
              id="payslips-table"
              loading={isLoading}
              collection={DataTable.collection({
                items: filteredPayslips,
                itemToValue: (item) => item.id,
                itemToString: (item) => item.user?.name || item.userId,
              })}
              search={{
                enabled: true,
                placeholder: 'Search employee',
                defaultValue: '',
                onValueChange: setSearchTerm,
              }}
              columns={[
                {
                  id: 'name',
                  heading: 'Name',
                  cell: (item) => (
                    <Typography
                      variant="body2"
                      color="primary"
                      onClick={() => setPayslip(item)}
                      sx={{
                        fontWeight: 500,
                        cursor: 'pointer',
                        '&:hover': { textDecoration: 'underline' },
                      }}
                    >
                      {item.user?.name || 'Unknown'}
                    </Typography>
                  ),
                  orderable: true,
                  width: 300,
                },
                {
                  id: 'totalHours',
                  heading: 'Total Hours',
                  cell: (item) => (
                    <Typography variant="body2" color="text.secondary">
                      {item.totalHours.toFixed(2)} hrs
                    </Typography>
                  ),
                  orderable: true,
                  width: 160,
                },
                {
                  id: 'rate',
                  heading: 'Rate',
                  cell: (item) => (
                    <Typography variant="body2" color="text.secondary">
                      {formatCurrency(parseFloat(item.rateSnapshot))}/
                      {item.rateTypeSnapshot.toLowerCase()}
                    </Typography>
                  ),
                  orderable: false,
                  width: 160,
                },
                {
                  id: 'billable',
                  heading: 'Billable',
                  cell: (item) => (
                    <Typography variant="body2" color="text.primary">
                      {formatCurrency(parseFloat(item.totalCompensation))}
                    </Typography>
                  ),
                  orderable: true,
                  width: 160,
                },
                {
                  id: 'status',
                  heading: 'Status',
                  cell: (item) => (
                    <Chip
                      label={toTitleCase(item.paymentStatus)}
                      color={getPaymentStatusColor(item.paymentStatus)}
                    />
                  ),
                  orderable: true,
                  width: 160,
                },
                {
                  id: 'paidAt',
                  heading: 'Paid Date',
                  cell: (item) => (
                    <Typography variant="body2" color="text.secondary">
                      {item.paidAt ? dayjs(item.paidAt).format('MM/DD/YY') : '-'}
                    </Typography>
                  ),
                  orderable: true,
                  width: 160,
                },
                {
                  id: 'actions',
                  heading: 'Actions',
                  cell: (item) => (
                    <PayslipProvider payslipId={item.id} payslip={item}>
                      <PayslipActions
                        paymentStatus={item.paymentStatus}
                        onMarkAsPaid={handleMarkAsPaid}
                        loading={markAsPaidMutation.isPending}
                        onView={setPayslip}
                        payrollRunStatus={payrollRun?.status}
                      />
                    </PayslipProvider>
                  ),
                  width: 200,
                },
              ]}
              emptyMessage="No payslips in this payroll run."
            />
          </>
        )}

        <ViewPayslipModal
          open={!!payslip}
          onClose={() => setPayslip(null)}
          payslip={payslip}
          onMarkPaid={handleMarkAsPaid}
          loading={markAsPaidMutation.isPending}
          payrollRunStatus={payrollRun?.status}
        />
      </PageContainer>
    </PageLayout>
  );
};
