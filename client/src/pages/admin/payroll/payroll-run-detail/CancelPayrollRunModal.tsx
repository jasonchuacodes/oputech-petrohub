import { CancelOutlined } from '@mui/icons-material';
import { Typography } from '@mui/material';

import { CustomModal } from '~/components/ui';

type CancelPayrollRunModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
  periodStart?: string;
  periodEnd?: string;
};

export const CancelPayrollRunModal = ({
  open,
  onClose,
  onConfirm,
  loading,
  periodStart,
  periodEnd,
}: CancelPayrollRunModalProps) => {
  return (
    <CustomModal
      onSubmit={onConfirm}
      onClose={onClose}
      open={open}
      type="danger"
      title="Cancel Payroll Run"
      subheader={
        <>
          <Typography variant="body2">
            You are about to cancel the payroll run
            {periodStart && periodEnd && (
              <>
                {' '}
                for period{' '}
                <Typography variant="inherit" component="span" color="warning.main">
                  {new Date(periodStart).toLocaleDateString()} -{' '}
                  {new Date(periodEnd).toLocaleDateString()}
                </Typography>
              </>
            )}
            .
          </Typography>
          <Typography variant="body2" mt={1}>
            Timesheets from unpaid payslips will be reverted to unprocessed status and can be
            included in future payroll runs.
          </Typography>
          <Typography variant="body2" mt={1}>
            Are you sure you want to continue?
          </Typography>
        </>
      }
      submitText="Cancel Payroll Run"
      loading={loading}
      icon={CancelOutlined}
    />
  );
};
