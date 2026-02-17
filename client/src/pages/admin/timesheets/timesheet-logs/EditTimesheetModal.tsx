import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarMonthOutlined } from '@mui/icons-material';
import { Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { NumberInput } from '~/components/form';
import { CustomModal } from '~/components/ui';
import { useTimesheetLogContext } from '~/context/timesheetLog';
import { UpdateTimesheetSchema, type UpdateTimesheetParams } from '~/schema/updateTimesheetSchema';
import { useUpdateTimesheetMutation } from '~/services/timesheet/timesheet.queries';
import { TimesheetEntryActionEnum } from '~/services/timesheet/timesheet.types';
import { parseBackendError } from '~/utils/parseBackendError';

type EditTimesheetModalProps = {
  open: boolean;
  onClose: () => void;
};

export const EditTimesheetModal = ({ open, onClose }: EditTimesheetModalProps) => {
  const { timesheetLog } = useTimesheetLogContext();
  const { id: timesheetId, createdAt, entries, totalHours, processed } = timesheetLog;

  const firstCheckIn = entries.find((e) => e.action === TimesheetEntryActionEnum.CHECK_IN);
  const lastCheckOut = [...entries]
    .reverse()
    .find((e) => e.action === TimesheetEntryActionEnum.CHECK_OUT);

  const {
    control,
    formState: { isValid },
    handleSubmit,
    reset,
  } = useForm<UpdateTimesheetParams>({
    defaultValues: { totalHours },
    resolver: zodResolver(UpdateTimesheetSchema),
  });

  const { mutate: updateTimesheet, isPending: isUpdateTimesheetPending } =
    useUpdateTimesheetMutation();

  useEffect(() => {
    if (open) {
      reset({ totalHours });
    }
  }, [open, totalHours, reset]);

  const handleCancel = () => {
    reset();
    onClose();
  };

  const onSubmit = handleSubmit(({ totalHours }: UpdateTimesheetParams) => {
    if (processed) {
      toast.error('That action cannot be done. Timesheet already processed.');
      return;
    }

    updateTimesheet(
      {
        timesheetId,
        totalHours,
      },
      {
        onSuccess: () => {
          toast.success('Successfully updated timesheet');
          reset();
          onClose();
        },
        onError: (err) => {
          const parsedErr = parseBackendError(err);
          toast.error(`Failed to update timesheet: ${parsedErr}`);
        },
      },
    );
  });

  return (
    <CustomModal
      open={open}
      onClose={handleCancel}
      onCancel={handleCancel}
      onSubmit={onSubmit}
      disabled={!isValid || isUpdateTimesheetPending}
      loading={isUpdateTimesheetPending}
      title="Edit Timesheet"
      submitText="Save Changes"
      maxWidth={500}
      icon={CalendarMonthOutlined}
    >
      <Stack spacing={3}>
        <Stack spacing={2}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="body2" color="text.secondary">
              Date:
            </Typography>
            <Typography variant="body2" fontWeight={500}>
              {dayjs(createdAt).format('MMMM DD, YYYY')}
            </Typography>
          </Stack>

          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="body2" color="text.secondary">
              Check In:
            </Typography>
            <Typography variant="body2" fontWeight={500}>
              {firstCheckIn ? dayjs(firstCheckIn.timestamp).format('hh:mm A') : '—'}
            </Typography>
          </Stack>

          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="body2" color="text.secondary">
              Check Out:
            </Typography>
            <Typography variant="body2" fontWeight={500}>
              {lastCheckOut ? dayjs(lastCheckOut.timestamp).format('hh:mm A') : '—'}
            </Typography>
          </Stack>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
            <Typography variant="body2" color="text.secondary" sx={{ pt: 1 }}>
              Total Hours:
            </Typography>
            <NumberInput
              name="totalHours"
              control={control}
              placeholder="0.00"
              size="small"
              fullWidth={false}
              width={120}
              min={0}
              max={16}
              step={0.5}
            />
          </Stack>
        </Stack>
      </Stack>
    </CustomModal>
  );
};
