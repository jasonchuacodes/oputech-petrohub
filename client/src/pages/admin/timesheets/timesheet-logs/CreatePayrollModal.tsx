import { Divider, Stack, Typography } from '@mui/material';
import { Dayjs } from 'dayjs';
import toast from 'react-hot-toast';

import { CustomModal } from '~/components/ui';
import { useGeneratePayrollMutation } from '~/services/payroll/payroll.queries';
import { PayrollPeriodType } from '~/services/payroll/payroll.types';
import type { UnprocessedTimesheet } from '~/services/payroll/payroll.types';
import type { SalaryRate } from '~/services/salary/salary.types';
import { parseBackendError } from '~/utils/parseBackendError';

interface CreatePayrollModalProps {
  open: boolean;
  onClose: () => void;
  userId: string;
  tenantId: string;
  startDate: Dayjs | null;
  endDate: Dayjs | null;
  unprocessedTimesheets: UnprocessedTimesheet[];
  salaryRate: SalaryRate;
}

export const CreatePayrollModal = ({
  open,
  onClose,
  userId,
  tenantId,
  startDate,
  endDate,
  unprocessedTimesheets,
  salaryRate,
}: CreatePayrollModalProps) => {
  const { mutateAsync: generatePayroll, isPending } = useGeneratePayrollMutation();

  const totalHours = unprocessedTimesheets.reduce(
    (sum, timesheet) => sum + timesheet.totalHours,
    0
  );

  const totalCompensation = totalHours * salaryRate.rate;

  const handleConfirm = async () => {
    try {
      await generatePayroll({
        userId,
        tenantId,
        timesheetIds: unprocessedTimesheets.map((t) => t.id),
        periodType: PayrollPeriodType.WEEKLY,
        periodStart: startDate?.toISOString() || '',
        periodEnd: endDate?.toISOString() || '',
      });

      toast.success('Payroll created successfully');
      onClose();
    } catch (err) {
      const parsedError = parseBackendError(err);
      toast.error(`Failed to create payroll: ${parsedError}`);
    }
  };

  return (
    <CustomModal
      open={open}
      onClose={onClose}
      title="Create Payroll"
      maxWidth={560}
      onSubmit={handleConfirm}
      onCancel={onClose}
      submitText="Confirm & Create"
      cancelText="Cancel"
      loading={isPending}
      disabled={isPending}
    >
      <Stack spacing={2}>
        <Typography variant="body2" color="text.secondary">
          Review the payroll details before creating
        </Typography>

        <Divider />

        <Stack spacing={1}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="body2" color="text.secondary">
              Period
            </Typography>
            <Typography variant="body2" fontWeight="medium">
              {startDate?.format('MMM D, YYYY')} - {endDate?.format('MMM D, YYYY')}
            </Typography>
          </Stack>

          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="body2" color="text.secondary">
              Total Timesheets
            </Typography>
            <Typography variant="body2" fontWeight="medium">
              {unprocessedTimesheets.length}{' '}
              {unprocessedTimesheets.length === 1 ? 'entry' : 'entries'}
            </Typography>
          </Stack>

          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="body2" color="text.secondary">
              Total Hours
            </Typography>
            <Typography variant="body2" fontWeight="medium">
              {totalHours.toFixed(2)} hrs
            </Typography>
          </Stack>

          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="body2" color="text.secondary">
              Rate
            </Typography>
            <Typography variant="body2" fontWeight="medium">
              ₱{salaryRate.rate.toFixed(2)}/{salaryRate.rateType.toLowerCase()}
            </Typography>
          </Stack>

          <Divider />

          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="body1" fontWeight="medium">
              Total Compensation
            </Typography>
            <Typography variant="body1" fontWeight="bold" color="primary">
              ₱{totalCompensation.toFixed(2)}
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    </CustomModal>
  );
};
