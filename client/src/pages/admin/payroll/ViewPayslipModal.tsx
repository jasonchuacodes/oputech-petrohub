import { ReceiptLongOutlined } from '@mui/icons-material';
import { Box, Divider, Stack, Typography } from '@mui/material';

import { CustomModal, Show } from '~/components/ui';
import { formatCurrency, formatNumber } from '~/utils/number';

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

type ViewPayslipModalProps = {
  open: boolean;
  onClose: () => void;
  payslip: PayslipData | null;
};

export const ViewPayslipModal = ({ open, onClose, payslip }: ViewPayslipModalProps) => {
  if (!payslip) return null;

  return (
    <CustomModal
      open={open}
      onClose={onClose}
      title="Payslip Details"
      subheader="View the details of an existing payslip."
      icon={ReceiptLongOutlined}
      hideActions={true}
    >
      <Stack spacing={3} >
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
                {payslip.name}
              </Typography>
            </Stack>
            <Stack direction="row">
              <Typography variant="body2" color="text.secondary" width="50%">
                Position
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {payslip.position ?? '—'}
              </Typography>
            </Stack>
            <Stack direction="row">
              <Typography variant="body2" color="text.secondary" width="50%">
                Salary Rate
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {formatCurrency(payslip.salaryRate)}/day
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
                {formatNumber(payslip.overtime, 2)} hrs
              </Typography>
            </Stack>

            <Divider />
            <Stack direction="row">
              <Typography variant="body2" color="text.secondary" width="50%">
                Gross Pay
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {formatCurrency(payslip.grossPay)}
              </Typography>
            </Stack>
          </Stack>
        </Stack>

        {/* Deductions */}
        <Stack spacing={1}>
          <Typography variant="subtitle2" color="text.primary">
            Deductions:
          </Typography>
          <Stack pl={1} spacing={1}>
            {payslip.deductions.map((deduction, index) => (
              <Stack key={index} direction="row">
                <Typography variant="body2" color="text.secondary" width="50%">
                  {deduction.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {formatCurrency(deduction.amount)}
                </Typography>
              </Stack>
            ))}
            <Show when={payslip.deductions.length > 1}>
              <Divider />

              <Stack direction="row">
                <Typography
                  variant="body2"
                  color="text.secondary"
                  width="50%"
                >
                  Total Deductions
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {formatCurrency(payslip.totalDeductions)}
                </Typography>
              </Stack>
            </Show>
          </Stack>
        </Stack>

        {/* Net Pay */}
        <Box bgcolor="primary.alpha" borderRadius={2} p={2}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="subtitle2" color="success.dark">
              Net Pay
            </Typography>
            <Typography variant="body2" fontWeight={600} color="success.dark">
              {formatCurrency(payslip.netAmount)}
            </Typography>
          </Stack>
        </Box>
      </Stack>
    </CustomModal>
  );
};
