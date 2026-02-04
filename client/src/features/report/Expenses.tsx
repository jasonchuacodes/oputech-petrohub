import { AddOutlined, EditOutlined, RemoveOutlined } from '@mui/icons-material';
import { Stack, Typography, IconButton, Divider } from '@mui/material';
import { useState } from 'react';
import toast from 'react-hot-toast';

import { Button, CardContainer, Show } from '~/components/ui';
import { formatCurrency, formatNumber } from '~/utils/number';
import { useDisclosure } from '~/hooks/useDisclosure';
import { useDeleteExpenseMutation } from '~/services/report/report.queries';
import type { ReportExpense } from '~/services/report/report.types';

import { AddExpenseModal } from './AddExpenseModal';

type ExpensesProps = {
  reportId: string;
  expenses: ReportExpense[];
  totalExpenses: number;
  isReadOnly: boolean;
};

export const Expenses = ({ reportId, expenses, totalExpenses, isReadOnly }: ExpensesProps) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const expenseDisclosure = useDisclosure();
  const { mutateAsync: deleteExpense } = useDeleteExpenseMutation();

  const handleRemove = async (expenseId: string) => {
    try {
      await deleteExpense({ reportId, expenseId });
    } catch {
      toast.error('Failed to remove expense item');
    }
  };

  return (
    <Stack spacing={0.5}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="body1" fontWeight={600} color="text.primary">
          Expenses
        </Typography>
        <Show when={!isReadOnly && expenses.length > 0}>
          <IconButton size="small" onClick={() => setIsEditMode(!isEditMode)}>
            <EditOutlined />
          </IconButton>
        </Show>
      </Stack>

      <CardContainer height="fit-content" spacing={2}>
        <Show when={expenses.length > 0}>
          <Stack spacing={1}>
            {expenses.map((item) => (
              <Stack
                key={item.id}
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                spacing={1}
              >
                <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>
                  {item.description}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ minWidth: 80, textAlign: 'right' }}
                >
                  {formatNumber(Number(item.amount), 2)}
                </Typography>
                {isEditMode && (
                  <IconButton size="small" onClick={() => handleRemove(item.id)}>
                    <RemoveOutlined fontSize="small" />
                  </IconButton>
                )}
              </Stack>
            ))}

            <Show when={expenses.length > 1}>
              <Divider />
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="body2">Total</Typography>
                <Typography variant="body2">{formatCurrency(totalExpenses)}</Typography>
              </Stack>
            </Show>
          </Stack>
        </Show>

        <Show when={!isReadOnly}>
          <Button
            onClick={() => expenseDisclosure.setOpen(true)}
            variant="outlined"
            startIcon={<AddOutlined />}
          >
            <Typography>Add Expense</Typography>
          </Button>
        </Show>

        <AddExpenseModal
          open={expenseDisclosure.open}
          onClose={() => expenseDisclosure.setOpen(false)}
          reportId={reportId}
        />
      </CardContainer>
    </Stack>
  );
};
