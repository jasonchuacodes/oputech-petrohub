import { EditOutlined } from '@mui/icons-material';
import { Stack, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { useEffect } from 'react';

import { CustomModal } from '~/components/ui';
import { Input, TimePicker } from '~/components/form';
import { useShiftContext } from '~/context/shift';
import { useTenantContext } from '~/context/tenant/useTenantContext';
import { useUpdateShiftMutation } from '~/services/shift/shift.queries';
import { CreateShiftSchema, type CreateShiftInput } from '~/schema/createShiftSchema';

type EditShiftModalProps = {
  open: boolean;
  onClose: () => void;
};

export const EditShiftModal = ({ open, onClose }: EditShiftModalProps) => {
  const { shift } = useShiftContext();
  const { tenantId } = useTenantContext();
  const { mutateAsync: updateShift, isPending } = useUpdateShiftMutation();

  const { control, handleSubmit, reset } = useForm<CreateShiftInput>({
    defaultValues: {
      name: '',
      shiftStart: undefined,
      shiftEnd: undefined,
    },
    resolver: zodResolver(CreateShiftSchema),
  });

  useEffect(() => {
    if (shift) {
      reset({
        name: shift.name,
        shiftStart: new Date(shift.shiftStart),
        shiftEnd: new Date(shift.shiftEnd),
      });
    }
  }, [shift, reset]);

  const onSubmit = async (data: CreateShiftInput) => {
    if (!tenantId || !shift) return;
    try {
      await updateShift({
        shiftId: shift.id,
        tenantId,
        data: {
          name: data.name,
          shiftStart: data.shiftStart.toISOString(),
          shiftEnd: data.shiftEnd.toISOString(),
        },
      });
      toast.success('Shift updated successfully');
      onClose();
    } catch {
      toast.error('Failed to update shift');
    }
  };

  return (
    <CustomModal
      onSubmit={handleSubmit(onSubmit)}
      onClose={onClose}
      open={open}
      title="Update Shift"
      subheader="Edit an existing shift schedule."
      submitText="Update"
      maxWidth={560}
      loading={isPending}
      icon={EditOutlined}
    >
      <Stack spacing={2}>
        <Input control={control} name="name" label="Shift Name" placeholder="Morning Shift" />
        <Stack alignItems="center" direction="row" spacing={2}>
          <TimePicker control={control} name="shiftStart" label="Shift Start" />
          <Typography variant="body2">—</Typography>
          <TimePicker control={control} name="shiftEnd" label="Shift End" />
        </Stack>
      </Stack>
    </CustomModal>
  );
};
