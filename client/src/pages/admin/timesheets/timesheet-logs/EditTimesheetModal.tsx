import { zodResolver } from '@hookform/resolvers/zod';
import { Stack, TextField, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { CustomModal } from '~/components/ui';
import { UpdateTimesheetSchema, type UpdateTimesheetParams } from '~/schema/updateTimesheetSchema';
import { useUpdateTimesheetMutation } from '~/services/timesheet/timesheet.queries';
import { TimesheetEntryActionEnum, type Timesheet } from '~/services/timesheet/timesheet.types';
import { parseBackendError } from '~/utils/parseBackendError';

type EditTimesheetModalProps = {
  open: boolean;
  onClose: () => void;
  timesheet: Timesheet;
};

export const EditTimesheetModal = ({ open, onClose, timesheet }: EditTimesheetModalProps) => {
  const { id: timesheetId, createdAt, entries, totalHours } = timesheet;

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
      maxWidth={400}
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
          <Stack direction="row" justifyContent="space-between" alignItems="top">
            <Typography variant="body2" color="text.secondary">
              Total Hours:
            </Typography>
            <Controller
              name="totalHours"
              control={control}
              render={({ field: { onChange, value, ...field } }) => (
                <TextField
                  sx={{ '& .MuiInputBase-input': { fontSize: '0.875rem' }, width: 120 }}
                  placeholder="0.00"
                  {...field}
                  value={value?.toFixed(2) ?? ''}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    onChange(isNaN(val) ? 0 : val);
                  }}
                  type="number"
                  size="small"
                  slotProps={{
                    htmlInput: {
                      min: 0,
                      max: 16,
                      step: 0.5,
                    },
                  }}
                />
              )}
            />
          </Stack>
        </Stack>
      </Stack>
    </CustomModal>
  );
};
