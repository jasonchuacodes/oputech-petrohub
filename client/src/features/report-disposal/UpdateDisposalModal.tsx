import { alpha, Box, Divider, Stack, Typography } from '@mui/material';
import { zodResolver } from '@hookform/resolvers/zod';
import { EditOutlined } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { useMemo } from 'react';
import toast from 'react-hot-toast';

import { CustomModal } from '~/components/ui';
import { NumberInput } from '~/components/form';
import { useUpdateDisposalMutation } from '~/services/report/report.queries';
import { UpdateDisposalSchema, type UpdateDisposalInput } from '~/schema/updateDisposalSchema';
import { formatCurrency, formatNumber } from '~/utils/number';
import type { ReportDisposal } from '~/services/report/report.types';
import theme from '~/theme';

type UpdateDisposalModalProps = {
  open: boolean;
  onClose: () => void;
  reportId: string;
  disposal: ReportDisposal;
};

export const UpdateDisposalModal = ({
  open,
  onClose,
  reportId,
  disposal,
}: UpdateDisposalModalProps) => {
  const { mutateAsync: updateDisposal, isPending } = useUpdateDisposalMutation();

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { isValid },
  } = useForm<UpdateDisposalInput>({
    defaultValues: {
      afterReading: Number(disposal.afterReading),
    },
    resolver: zodResolver(UpdateDisposalSchema),
  });

  const afterReading = watch('afterReading');

  const { netDisposal, totalSales } = useMemo(() => {
    const net = afterReading - disposal.beforeReading;
    const total = net * disposal.priceSnapshot;

    return {
      netDisposal: net,
      totalSales: total,
    };
  }, [afterReading, disposal.beforeReading, disposal.priceSnapshot]);

  const onSubmit = async (data: UpdateDisposalInput) => {
    try {
      await updateDisposal({
        reportId,
        disposalId: disposal.id,
        data: {
          afterReading: data.afterReading,
        },
      });
      toast.success('Disposal updated successfully');
      reset();
      onClose();
    } catch {
      toast.error('Failed to update disposal');
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
      title={`${disposal.product.name} Disposal`}
      subheader='Update fuel product disposal reading.'
      submitText="Update"
      loading={isPending}
      maxWidth={560}
      icon={EditOutlined}
      disabled={!isValid}
    >
      <Stack spacing={2}>
        <Stack flex={1} spacing={1}>
          <NumberInput
            label="After Reading"
            control={control}
            placeholder="0.00"
            name="afterReading"
            step={1}
            min={0}
          />
          <Stack flex={1} justifyContent="space-between" spacing={0.5}>
            <Typography variant="body2" color="textSecondary">
              Before Reading
            </Typography>
            <Box
              sx={{
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: alpha(theme.palette.grey[100], 0.8),
                px: 1.5,
                py: 0.5,
                height: 48,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Typography variant="body1">
                {disposal.beforeReading}
              </Typography>
            </Box>
          </Stack>
        </Stack>

        <Divider />

        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body2" color="textSecondary">
            Net Disposal
          </Typography>
          <Typography variant="body2">{formatNumber(netDisposal, 3)}</Typography>
        </Stack>

        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body2" color="textSecondary">
            Fuel Price
          </Typography>
          <Typography variant="body2">{formatCurrency(disposal.priceSnapshot)}</Typography>
        </Stack>

        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body2" color="textSecondary">
            Total Sales
          </Typography>
          <Typography variant="body2" fontWeight={600}>
            {formatCurrency(totalSales)}
          </Typography>
        </Stack>
      </Stack>
    </CustomModal>
  );
};
