import { AddOutlined, EditOutlined, RemoveOutlined } from '@mui/icons-material';
import { Stack, Typography, IconButton, Divider } from '@mui/material';
import { useState } from 'react';
import toast from 'react-hot-toast';

import { Button, CardContainer, Show } from '~/components/ui';
import { formatCurrency, formatNumber } from '~/utils/number';
import { useDisclosure } from '~/hooks/useDisclosure';
import { useDeleteIncomeMutation } from '~/services/report/report.queries';
import type { ReportIncome } from '~/services/report/report.types';

import { AddIncomeModal } from './AddIncomeModal';

type IncomeProps = {
  reportId: string;
  income: ReportIncome[];
  totalIncome: number;
  isReadOnly: boolean;
};

export const Income = ({ reportId, income, totalIncome, isReadOnly }: IncomeProps) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const incomeDisclosure = useDisclosure();
  const { mutateAsync: deleteIncome } = useDeleteIncomeMutation();

  const handleRemove = async (incomeId: string) => {
    try {
      await deleteIncome({ reportId, incomeId });
    } catch {
      toast.error('Failed to remove income item');
    }
  };

  return (
    <Stack spacing={0.5}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="body1" fontWeight={600} color="text.primary">
          Income
        </Typography>
        {!isReadOnly && (
          <IconButton size="small" onClick={() => setIsEditMode(!isEditMode)}>
            <EditOutlined />
          </IconButton>
        )}
      </Stack>

      <CardContainer height="fit-content" spacing={2}>
        <Show when={income.length > 0}>
          <Stack spacing={1}>
            {income.map((item) => (
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

            <Show when={income.length > 1}>
              <Divider />
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="body2">Total</Typography>
                <Typography variant="body2">{formatCurrency(totalIncome)}</Typography>
              </Stack>
            </Show>
          </Stack>
        </Show>

        <Show when={!isReadOnly}>
          <Button
            onClick={() => incomeDisclosure.setOpen(true)}
            variant="outlined"
            startIcon={<AddOutlined />}
          >
            <Typography>Add Income</Typography>
          </Button>
        </Show>

        <AddIncomeModal
          open={incomeDisclosure.open}
          onClose={() => incomeDisclosure.setOpen(false)}
          reportId={reportId}
        />
      </CardContainer>
    </Stack>
  );
};
