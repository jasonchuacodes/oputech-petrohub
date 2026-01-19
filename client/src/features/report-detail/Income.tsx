import { MoreHorizOutlined } from '@mui/icons-material';
import { Stack, Typography, IconButton, Divider } from '@mui/material';

import { CardContainer } from '~/components/ui';
import { formatCurrency, formatNumber } from '~/utils/number';

const mockIncome = [
  { id: '1', name: 'Cash', amount: 12000 },
  { id: '2', name: 'Cash', amount: 10000 },
  { id: '3', name: 'Cash', amount: 24500 },
  { id: '4', name: 'Cash', amount: 8500 },
];

const totalIncome = 12000 + 10000 + 24500 + 8500;

export const Income = () => {
  return (
    <Stack>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="body1" fontWeight={600} color="text.primary">
          Income
        </Typography>
        <IconButton>
          <MoreHorizOutlined />
        </IconButton>
      </Stack>

      <CardContainer height="fit-content" spacing={1}>
        <Stack spacing={1}>
          {mockIncome.map((income) => (
            <Stack
              key={income.id}
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              spacing={1}
            >
              <Typography variant="body1">{income.name}</Typography>
              <Typography variant="body1">{formatNumber(income.amount, 2)}</Typography>
            </Stack>
          ))}
        </Stack>
        <Divider />
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="body1">Total</Typography>
          <Typography variant="body1">{formatCurrency(totalIncome)}</Typography>
        </Stack>
      </CardContainer>
    </Stack>
  );
};
