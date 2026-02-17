import { Stack } from '@mui/material';

import { Button } from '~/components/ui';
import { usePayslipContext } from '~/context/payroll/usePayslipContext';
import { useDisclosure } from '~/hooks/useDisclosure';
import { PaymentStatus } from '~/services/payroll/payroll.types';

import { ViewPayslipModal } from '../ViewPayslipModal';

type PayslipActionsProps = {
  paymentStatus: PaymentStatus;
  onMarkAsPaid: (payslipId: string) => void;
  isMarkingAsPaid: boolean;
};

export const PayslipActions = ({
  paymentStatus,
  onMarkAsPaid,
  isMarkingAsPaid,
}: PayslipActionsProps) => {
  const { payslip, payslipId } = usePayslipContext();
  const disclosure = useDisclosure();

  return (
    <>
      <Stack direction="row" spacing={1} ml={-2}>
        <Button variant="text" size="small" onClick={disclosure.onOpen}>
          View
        </Button>
        {paymentStatus === PaymentStatus.UNPAID && (
          <Button
            variant="text"
            size="small"
            onClick={() => onMarkAsPaid(payslipId)}
            disabled={isMarkingAsPaid}
          >
            Mark as Paid
          </Button>
        )}
      </Stack>

      <ViewPayslipModal open={disclosure.open} onClose={disclosure.onClose} payslip={payslip} />
    </>
  );
};
