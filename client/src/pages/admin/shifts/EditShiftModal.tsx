import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Typography,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { useEffect } from 'react';

import { Button, Form } from '~/components/ui';
import { Input, TimePicker } from '~/components/form';
import { useTenantContext } from '~/context/tenant/useTenantContext';
import { useUpdateShiftMutation } from '~/services/shift/shift.queries';
import { CreateShiftSchema, type CreateShiftInput } from '~/schema/createShiftSchema';
import type { Shift } from '~/services/shift/shift.types';

type EditShiftModalProps = {
  open: boolean;
  onClose: () => void;
  shift: Shift | null;
};

export const EditShiftModal = ({ open, onClose, shift }: EditShiftModalProps) => {
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
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Shift</DialogTitle>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Stack spacing={2}>
            <Stack spacing={0.5}>
              <Typography variant="body2" fontWeight="medium">
                Shift Name
              </Typography>
              <Input control={control} name="name" placeholder="Morning Shift" />
            </Stack>
            <Stack spacing={0.5}>
              <Typography variant="body2" fontWeight="medium">
                Shift Start
              </Typography>
              <TimePicker control={control} name="shiftStart" label="" />
            </Stack>
            <Stack spacing={0.5}>
              <Typography variant="body2" fontWeight="medium">
                Shift End
              </Typography>
              <TimePicker control={control} name="shiftEnd" label="" />
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} variant="text">
            Cancel
          </Button>
          <Button type="submit" variant="contained" loading={isPending}>
            Update
          </Button>
        </DialogActions>
      </Form>
    </Dialog>
  );
};
