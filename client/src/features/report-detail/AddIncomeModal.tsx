import { Stack } from '@mui/material';
import { zodResolver } from '@hookform/resolvers/zod';
import { AddOutlined } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { CustomModal } from '~/components/ui';
import { Input } from '~/components/form';
import { useCreateIncomeMutation } from '~/services/report/report.queries';
import { CreateIncomeSchema, type CreateIncomeInput } from '~/schema/createIncomeSchema';

type AddIncomeModalProps = {
  open: boolean;
  onClose: () => void;
  reportId: string;
};

export const AddIncomeModal = ({ open, onClose, reportId }: AddIncomeModalProps) => {
  const { mutateAsync: createIncome, isPending } = useCreateIncomeMutation();

  const {
    control,
    handleSubmit,
    reset,
    formState: { isValid },
  } = useForm<CreateIncomeInput>({
    defaultValues: {
      description: '',
      amount: 0.01,
    },
    resolver: zodResolver(CreateIncomeSchema),
  });

  const onSubmit = async (data: CreateIncomeInput) => {
    try {
      await createIncome({
        reportId,
        data: {
          description: data.description,
          amount: data.amount,
        },
      });
      toast.success('Income added successfully');
      reset();
      onClose();
    } catch {
      toast.error('Failed to add income');
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <CustomModal
      open={open}
      onClose={handleClose}
      onSubmit={handleSubmit(onSubmit)}
      title="Add Income"
      subheader="Record a new income entry for this report."
      submitText="Add Income"
      loading={isPending}
      maxWidth={560}
      icon={AddOutlined}
      disabled={!isValid}
    >
      <Stack spacing={2}>
        <Input
          label="Description"
          control={control}
          name="description"
          placeholder="e.g., Cash sales"
        />
        <Input
          label="Amount"
          control={control}
          name="amount"
          type="number"
          startAdornment="₱"
          placeholder="0.00"
          slotProps={{
            input: { step: '1.00', min: '0.00' },
          }}
        />
      </Stack>
    </CustomModal>
  );
};
