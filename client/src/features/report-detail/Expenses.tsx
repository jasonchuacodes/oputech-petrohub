import { MoreHorizOutlined } from '@mui/icons-material';
import { Stack, Typography, IconButton, Divider } from '@mui/material';

import { CardContainer } from '~/components/ui';
import { formatCurrency, formatNumber } from '~/utils/number';

const mockExpenses = [
  { id: '1', name: 'Philhealth payment', amount: 12000 },
  { id: '2', name: 'SSS payment', amount: 24500 },
  { id: '3', name: 'PAGIBIG payment', amount: 8500 },
  { id: '4', name: 'Oil change', amount: 10000 },
];

const totalIncome = 12000 + 10000 + 24500 + 8500;

export const Expenses = () => {
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

      <CardContainer height="fit-content" spacing={1}>
        <Stack spacing={1}>
          {mockExpenses.map((income) => (
            <Stack
              key={income.id}
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              spacing={1}
            >
              <Typography variant="body2">{income.name}</Typography>
              <Typography variant="body2">{formatNumber(income.amount, 2)}</Typography>
            </Stack>
          ))}
        </Stack>
        <Divider />
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="body2">Total</Typography>
          <Typography variant="body2">{formatCurrency(totalIncome)}</Typography>
        </Stack>
      </CardContainer>
    </Stack>
  );
};
