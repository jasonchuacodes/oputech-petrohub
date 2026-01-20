import { AddOutlined, MoreHorizOutlined } from '@mui/icons-material';
import { Stack, Typography, IconButton, Divider } from '@mui/material';

import { Button, CardContainer, Show } from '~/components/ui';
import { formatCurrency, formatNumber } from '~/utils/number';
import { useDisclosure } from '../../hooks/useDisclosure';
import { AddExpenseModal } from './AddExpenseModal';
import type { ReportExpense } from '~/services/report/report.types';

type ExpensesProps = {
  reportId: string;
  expenses: ReportExpense[];
  totalExpenses: number;
  isReadOnly: boolean;
};

export const Expenses = ({ reportId, expenses, totalExpenses, isReadOnly }: ExpensesProps) => {
  const expenseDisclosure = useDisclosure();

  return (
    <Stack>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="body1" fontWeight={600} color="text.primary">
          Expenses
        </Typography>
        <IconButton>
          <MoreHorizOutlined />
        </IconButton>
      </Stack>

      <CardContainer height="fit-content" spacing={2}>
        <Stack spacing={1}>
          {expenses.map((item) => (
            <Stack
              key={item.id}
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              spacing={1}
            >
              <Typography variant="body2">{item.description}</Typography>
              <Typography variant="body2">{formatNumber(Number(item.amount), 2)}</Typography>
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
