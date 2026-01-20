import { Stack } from '@mui/material';
import { zodResolver } from '@hookform/resolvers/zod';
import { AddOutlined } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { CustomModal } from '~/components/ui';
import { Input } from '~/components/form';
import { useCreateExpenseMutation } from '~/services/report/report.queries';
import { CreateExpenseSchema, type CreateExpenseInput } from '~/schema/createExpenseSchema';

type AddExpenseModalProps = {
  open: boolean;
  onClose: () => void;
  reportId: string;
};

export const AddExpenseModal = ({ open, onClose, reportId }: AddExpenseModalProps) => {
  const { mutateAsync: createExpense, isPending } = useCreateExpenseMutation();

  const {
    control,
    handleSubmit,
    reset,
    formState: { isValid },
  } = useForm<CreateExpenseInput>({
    defaultValues: {
      description: '',
      amount: 0.01,
    },
    resolver: zodResolver(CreateExpenseSchema),
  });

  const onSubmit = async (data: CreateExpenseInput) => {
    try {
      await createExpense({
        reportId,
        data: {
          description: data.description,
          amount: data.amount,
        },
      });
      toast.success('Expense added successfully');
      reset();
      onClose();
    } catch {
      toast.error('Failed to add expense');
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
      title="Add Expense"
      subheader="Record a new expense entry for this report."
      submitText="Add Expense"
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
          placeholder="e.g., Fuel"
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
