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

import { Button, Form } from '~/components/ui';
import { Input, TimePicker } from '~/components/form';
import { useTenantContext } from '~/context/tenant/useTenantContext';
import { useCreateShiftMutation } from '~/services/shift/shift.queries';
import { CreateShiftSchema, type CreateShiftInput } from '~/schema/createShiftSchema';

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
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create New Shift</DialogTitle>
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
            Create
          </Button>
        </DialogActions>
      </Form>
    </Dialog>
  );
};
