import { MoreHorizOutlined } from '@mui/icons-material';
import { Stack, Typography, IconButton, Divider } from '@mui/material';

import { CardContainer } from '~/components/ui';
import { formatCurrency, formatNumber } from '~/utils/number';

const mockLubricantSales = [
  { id: '1', name: 'HD SAE 40', quantity: 2, effectivePrice: 235, amount: 12000 },
  { id: '2', name: '2T 500mL', quantity: 3, effectivePrice: 50, amount: 12000 },
  { id: '3', name: '2T liter', quantity: 1, effectivePrice: 120, amount: 12000 },
  { id: '4', name: 'Gasul', quantity: 4, effectivePrice: 1280, amount: 12000 },
];

const totalLubricanSales = 12000 + 10000 + 24500 + 8500;

export const Lubricants = () => {
  return (
    <Stack>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="body1" fontWeight={600} color="text.primary">
          Lubricants
        </Typography>
        <IconButton>
          <MoreHorizOutlined />
        </IconButton>
      </Stack>

      <CardContainer height="fit-content" spacing={1}>
        <Stack spacing={1}>
          {/* Header Row */}
          <Stack direction="row" alignItems="center">
            <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>
              Name
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ width: 80, textAlign: 'right' }}
            >
              Quantity
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ width: 100, textAlign: 'right' }}
            >
              Amount
            </Typography>
          </Stack>

          {/* Data Rows */}
          {mockLubricantSales.map((sale) => (
            <Stack key={sale.id} direction="row" alignItems="center" spacing={1}>
              <Typography variant="body1" sx={{ flex: 1 }}>
                {sale.name}
              </Typography>
              <Typography variant="body1" sx={{ width: 80, textAlign: 'right' }}>
                {formatNumber(sale.quantity, 0)}
              </Typography>
              <Typography variant="body1" sx={{ width: 100, textAlign: 'right' }}>
                {formatNumber(sale.amount, 2)}
              </Typography>
            </Stack>
          ))}
        </Stack>
        <Divider />

        {/* Total Row */}
        <Stack direction="row" alignItems="center">
          <Typography variant="body1" fontWeight={600} sx={{ flex: 1 }}>
            Total
          </Typography>
          <Typography variant="body1" fontWeight={600} sx={{ width: 80 }} />
          <Typography variant="body1" fontWeight={600} sx={{ width: 100, textAlign: 'right' }}>
            {formatCurrency(totalLubricanSales)}
          </Typography>
        </Stack>
      </CardContainer>
    </Stack>
  );
};
