import { Stack, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';

import { CustomModal } from '~/components/ui';
import { Input, TimePicker } from '~/components/form';
import { useTenantContext } from '~/context/tenant/useTenantContext';
import { useCreateShiftMutation } from '~/services/shift/shift.queries';
import { CreateShiftSchema, type CreateShiftInput } from '~/schema/createShiftSchema';
import { CalendarMonthOutlined } from '@mui/icons-material';

type CreateShiftModalProps = {
  open: boolean;
  onClose: () => void;
};

export const CreateShiftModal = ({ open, onClose }: CreateShiftModalProps) => {
  const { tenantId } = useTenantContext();
  const { mutateAsync: createShift, isPending } = useCreateShiftMutation();

  const { control, handleSubmit, reset } = useForm<CreateShiftInput>({
    defaultValues: {
      name: '',
      shiftStart: undefined,
      shiftEnd: undefined,
    },
    resolver: zodResolver(CreateShiftSchema),
  });

  const onSubmit = async (data: CreateShiftInput) => {
    if (!tenantId) return;
    try {
      await createShift({
        tenantId,
        name: data.name,
        shiftStart: data.shiftStart.toISOString(),
        shiftEnd: data.shiftEnd.toISOString(),
      });
      toast.success('Shift created successfully');
      reset();
      onClose();
    } catch {
      toast.error('Failed to create shift');
    }
  };

  return (
    <CustomModal
      open={open}
      onClose={onClose}
      onSubmit={handleSubmit(onSubmit)}
      title="Create Shift Schedule"
      subheader="Create a new shift schedule for employees."
      submitText="Create Shift"
      loading={isPending}
      maxWidth={560}
      icon={CalendarMonthOutlined}
    >
      <Stack spacing={2}>
        <Stack spacing={0.5}>
          <Typography variant="body2" fontWeight="medium">
            Shift Name
          </Typography>
          <Input control={control} name="name" placeholder="Morning Shift" />
        </Stack>
        <Stack alignItems="center" direction="row" spacing={2}>
          <TimePicker control={control} name="shiftStart" label="Shift Start" />
          <Typography variant="body2">—</Typography>
          <TimePicker control={control} name="shiftEnd" label="Shift End" />
        </Stack>
      </Stack>
    </CustomModal>
  );
};
