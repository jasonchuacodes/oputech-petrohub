import { AddOutlined, MoreHorizOutlined } from '@mui/icons-material';
import { Stack, Typography, IconButton, Divider } from '@mui/material';

import { Button, CardContainer } from '~/components/ui';
import { formatCurrency, formatNumber } from '~/utils/number';
import { useDisclosure } from '../../hooks/useDisclosure';
import { AddIncomeModal } from './AddIncomeModal';
import type { ReportIncome } from '~/services/report/report.types';

type IncomeProps = {
  reportId: string;
  income: ReportIncome[];
  totalIncome: number;
  isReadOnly: boolean;
};

export const Income = ({ reportId, income, totalIncome, isReadOnly }: IncomeProps) => {
  const incomeDisclosure = useDisclosure();

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
        {income.length === 0 ? (
          !isReadOnly && (
            <Button
              onClick={() => incomeDisclosure.setOpen(true)}
              variant="outlined"
              startIcon={<AddOutlined />}
            >
              <Typography>Add Income</Typography>
            </Button>
          )
        ) : (
          <>
            <Stack spacing={1}>
              {income.map((item) => (
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
            </Stack>
            <Divider />
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="body2">Total</Typography>
              <Typography variant="body2">{formatCurrency(totalIncome)}</Typography>
            </Stack>

            {!isReadOnly && (
              <Button
                onClick={() => incomeDisclosure.setOpen(true)}
                variant="outlined"
                startIcon={<AddOutlined />}
              >
                <Typography>Add Income</Typography>
              </Button>
            )}
          </>
        )}

        <AddIncomeModal
          open={incomeDisclosure.open}
          onClose={() => incomeDisclosure.setOpen(false)}
          reportId={reportId}
        />
      </CardContainer>
    </Stack>
  );
};
