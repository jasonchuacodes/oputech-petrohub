import { EditOutlined, CloseOutlined } from '@mui/icons-material';
import {
  alpha,
  Box,
  Checkbox,
  FormControlLabel,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

import { CustomModal, DateTimePicker, InfoBox, Show } from '~/components/ui';
import { NumberInput } from '~/components/form';
import { useTenantContext } from '~/context/tenant/useTenantContext';
import {
  useUpdateProductTypePriceMutation,
  useCancelScheduledPriceMutation,
} from '~/services/product/product.queries';
import {
  UpdateProductTypePriceSchema,
  type UpdateProductTypePriceInput,
} from '~/schema/updateProductTypePriceSchema';
import type { Product } from '~/services/product/product.types';
import theme from '~/theme';
import { formatCurrency } from '~/utils/number';
import { formatDate, dayjsLocal } from '~/utils/date';

import { getProductTypeDisplayName } from '../products/utils';

type EditProductTypePriceModalProps = {
  open: boolean;
  onClose: () => void;
  product: Product;
};

export const EditProductTypePriceModal = ({
  open,
  onClose,
  product,
}: EditProductTypePriceModalProps) => {
  const { tenantId } = useTenantContext();
  const { mutateAsync: updateProductTypePrice, isPending } = useUpdateProductTypePriceMutation();
  const { mutateAsync: cancelScheduledPrice, isPending: isCancelling } =
    useCancelScheduledPriceMutation();

  const { control, handleSubmit, reset, formState, watch, setValue } =
    useForm<UpdateProductTypePriceInput>({
      defaultValues: {
        productPrice: 0,
        effectiveFrom: dayjsLocal(product.scheduledPrice?.effectiveFrom).toISOString(),
        future: false,
      },
      resolver: zodResolver(UpdateProductTypePriceSchema),
    });

  const future = watch('future');

  useEffect(() => {
    if (product) {
      reset({
        productPrice: product.productPrice?.price || 0,
        effectiveFrom: dayjsLocal(product.scheduledPrice?.effectiveFrom).toISOString(),
        future: false,
      });
    }
  }, [product, reset]);

  const onSubmit = async (data: UpdateProductTypePriceInput) => {
    if (!tenantId || !product.type) return;

    try {
      await updateProductTypePrice({
        tenantId,
        productType: product.type,
        data: {
          productPrice: data.productPrice,
          ...(data.future &&
            data.effectiveFrom && {
              effectiveFrom: new Date(data.effectiveFrom).toISOString(),
            }),
        },
      });

      toast.success('Fuel price updated successfully');
      onClose();
    } catch {
      toast.error('Failed to update fuel price');
    }
  };

  const handleClose = () => {
    onClose();
    reset();
  };

  return (
    <CustomModal
      onSubmit={handleSubmit(onSubmit)}
      onClose={handleClose}
      open={open}
      title="Update Fuel Price"
      subheader="Change the price for all products of this type"
      submitText="Update"
      maxWidth={480}
      loading={isPending}
      icon={EditOutlined}
      disabled={!formState.isValid || !formState.isDirty}
    >
      <Stack spacing={2}>
        {product.scheduledPrice && (
          <InfoBox variant="info">
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              pl={1}
              spacing={2}
            >
              <Typography
                variant="body2"
                sx={{
                  flex: 1,
                  minWidth: 0,
                  overflowWrap: 'break-word',
                  textWrap: 'wrap',
                }}
              >
                Price set to change to{' '}
                <Typography variant="inherit" component="span" color="warning.main">
                  {formatCurrency(product.scheduledPrice.price)}
                </Typography>{' '}
                on{' '}
                <Typography variant="inherit" component="span" color="warning.main">
                  {formatDate(product.scheduledPrice.effectiveFrom, 'MMMM DD, YYYY hh:mm A')}
                </Typography>
              </Typography>
              <Tooltip title="Cancel scheduled price change" sx={{ flexShrink: 0 }}>
                <IconButton
                  size="small"
                  disabled={isCancelling}
                  onClick={async () => {
                    try {
                      await cancelScheduledPrice({ productId: product.id, tenantId: tenantId! });
                      toast.success('Scheduled price change cancelled');
                    } catch {
                      toast.error('Failed to cancel scheduled price change');
                    }
                  }}
                >
                  <CloseOutlined fontSize="small" />
                </IconButton>
              </Tooltip>
            </Stack>
          </InfoBox>
        )}

        <Stack spacing={0.5} alignItems="start">
          <Typography variant="body2" color="text.primary" fontWeight={500}>
            Fuel Type
          </Typography>
          <Box
            sx={{
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              bgcolor: alpha(theme.palette.grey[100], 0.8),
              px: 1.5,
              py: 0.5,
              height: 40,
              display: 'flex',
              width: '100%',
              alignItems: 'center',
            }}
          >
            <Typography variant="body2" fontWeight={500}>
              {getProductTypeDisplayName(product.type)}
            </Typography>
          </Box>
        </Stack>

        <NumberInput
          label="Product Price"
          control={control}
          placeholder="0.00"
          name="productPrice"
          min={0.01}
        />

        <FormControlLabel
          sx={{
            width: 'fit-content',
            '& .MuiFormControlLabel-label': {
              fontSize: 'body2.fontSize',
              ml: 0.5,
            },
          }}
          control={
            <Checkbox
              checked={!!future}
              onChange={(e) => setValue('future', e.target.checked, { shouldValidate: true })}
              sx={{ p: 0 }}
            />
          }
          label="Schedule price change?"
        />

        <Show when={!!future} fallback={null}>
          <Controller
            name="effectiveFrom"
            control={control}
            render={({ field }) => (
              <DateTimePicker
                value={dayjsLocal(field.value)}
                onChange={(date) => field.onChange(date?.toISOString() ?? '')}
              />
            )}
          />
        </Show>
      </Stack>
    </CustomModal>
  );
};
