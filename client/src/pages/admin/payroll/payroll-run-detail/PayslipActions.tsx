import { Divider, Stack, Typography } from '@mui/material';

import { Button } from '~/components/ui';
import { usePayslipContext } from '~/context/payroll/usePayslipContext';
import { PaymentStatus, PayrollRunStatus, type Payslip } from '~/services/payroll/payroll.types';

type PayslipActionsProps = {
  paymentStatus: PaymentStatus;
  onMarkAsPaid: (id: string) => void;
  loading: boolean;
  onView: (payslip: Payslip) => void;
  payrollRunStatus?: PayrollRunStatus;
};

export const PayslipActions = ({
  paymentStatus,
  onMarkAsPaid,
  loading,
  onView,
  payrollRunStatus,
}: PayslipActionsProps) => {
  const { payslipId, payslip } = usePayslipContext();

  return (
    <Stack
      direction="row"
      spacing={1}
      ml={-2}
      alignItems="center"
      divider={<Divider orientation="vertical" sx={{ height: 20 }} />}
    >
      {paymentStatus === PaymentStatus.UNPAID && payrollRunStatus === PayrollRunStatus.PENDING && (
        <Button
          variant="text"
          size="small"
          onClick={() => onMarkAsPaid(payslipId)}
          disabled={loading}
        >
          <Typography variant="body2">Mark as Paid</Typography>
        </Button>
      )}
      <Button variant="text" size="small" onClick={() => onView(payslip)}>
        <Typography variant="body2">View</Typography>
      </Button>
    </Stack>
  );
};
