import { ReceiptLongOutlined } from '@mui/icons-material';
import { Box, Divider, Stack, Typography } from '@mui/material';

import { Button, CustomModal, Show } from '~/components/ui';
import { formatCurrency, formatNumber } from '~/utils/number';
import { PaymentStatus, PayrollRunStatus, type Payslip } from '~/services/payroll/payroll.types';

type ViewPayslipModalProps = {
  open: boolean;
  onClose: () => void;
  payslip: Payslip | null;
  onMarkPaid?: (payslipId: string) => void;
  loading?: boolean;
  payrollRunStatus?: PayrollRunStatus;
};

export const ViewPayslipModal = ({
  open,
  onClose,
  payslip,
  onMarkPaid,
  loading,
  payrollRunStatus,
}: ViewPayslipModalProps) => {
  if (!payslip) return null;

  // TODO: Implement deductions
  const deductions: { name: string; amount: number }[] = [];
  const totalDeductions = 0;

  return (
    <CustomModal
      open={open}
      onClose={onClose}
      title="Payslip Details"
      subheader="View the details of an existing payslip."
      icon={ReceiptLongOutlined}
      hideActions={true}
    >
      <Stack spacing={3} sx={{ textAlign: 'start' }}>
        {/* Employee Details */}
        <Stack spacing={1}>
          <Typography variant="subtitle2" color="text.primary">
            Employee Details:
          </Typography>
          <Stack pl={1} spacing={1}>
            <Stack direction="row">
              <Typography variant="body2" color="text.secondary" width="50%">
                Name
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {payslip.user?.name || 'Unknown'}
              </Typography>
            </Stack>
            <Stack direction="row">
              <Typography variant="body2" color="text.secondary" width="50%">
                Position
              </Typography>
              <Typography variant="body2" color="text.secondary">
                —
              </Typography>
            </Stack>
            <Stack direction="row">
              <Typography variant="body2" color="text.secondary" width="50%">
                Salary Rate
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {formatCurrency(parseFloat(payslip.rateSnapshot))}/
                {payslip.rateTypeSnapshot.toLowerCase()}
              </Typography>
            </Stack>
          </Stack>
        </Stack>

        {/* Earnings */}
        <Stack spacing={1}>
          <Typography variant="subtitle2" color="text.primary">
            Earnings:
          </Typography>
          <Stack pl={1} spacing={1}>
            <Stack direction="row">
              <Typography variant="body2" color="text.secondary" width="50%">
                Total Hours
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {formatNumber(payslip.totalHours, 2)} hrs
              </Typography>
            </Stack>
            <Stack direction="row">
              <Typography variant="body2" color="text.secondary" width="50%">
                Overtime
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {formatNumber(0, 2)} hrs
              </Typography>
            </Stack>

            <Divider />
            <Stack direction="row">
              <Typography variant="body2" color="text.secondary" width="50%">
                Gross Pay
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {formatCurrency(parseFloat(payslip.totalCompensation))}
              </Typography>
            </Stack>
          </Stack>
        </Stack>

        {/* Deductions */}
        <Show when={deductions.length > 0}>
          <Stack spacing={1}>
            <Typography variant="subtitle2" color="text.primary">
              Deductions:
            </Typography>
            <Stack pl={1} spacing={1}>
              {deductions.map((deduction, index) => (
                <Stack key={index} direction="row">
                  <Typography variant="body2" color="text.secondary" width="50%">
                    {deduction.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {formatCurrency(deduction.amount)}
                  </Typography>
                </Stack>
              ))}
              <Show when={deductions.length > 1}>
                <Divider />

                <Stack direction="row">
                  <Typography variant="body2" color="text.secondary" width="50%">
                    Total Deductions
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {formatCurrency(totalDeductions)}
                  </Typography>
                </Stack>
              </Show>
            </Stack>
          </Stack>
        </Show>

        {/* Notes */}
        <Show when={!!payslip.notes}>
          <Stack spacing={1}>
            <Typography variant="subtitle2" color="text.primary">
              Notes:
            </Typography>
            <Stack pl={1}>
              <Typography variant="body2" color="text.secondary">
                {payslip.notes}
              </Typography>
            </Stack>
          </Stack>
        </Show>

        {/* Net Pay */}
        <Stack justifyContent="space-between" spacing={1}>
          <Box bgcolor="primary.alpha" borderRadius={2} p={2} flex={1} minWidth={0}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography variant="subtitle2" color="success.dark">
                Net Pay
              </Typography>
              <Typography variant="body2" fontWeight={600} color="success.dark">
                {formatCurrency(parseFloat(payslip.totalCompensation) - totalDeductions)}
              </Typography>
            </Stack>
          </Box>
          <Show
            when={
              payrollRunStatus === PayrollRunStatus.PENDING &&
              payslip.paymentStatus === PaymentStatus.UNPAID
            }
          >
            {onMarkPaid && (
              <Button
                size="small"
                variant="contained"
                loading={loading}
                onClick={() => onMarkPaid(payslip.id)}
              >
                Mark as Paid
              </Button>
            )}
          </Show>
        </Stack>
      </Stack>
    </CustomModal>
  );
};
