import { EditOutlined } from '@mui/icons-material';
import { alpha, Box, Checkbox, FormControlLabel, Stack, Typography } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { dayjsLocal, formatDate } from '~/utils/date';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

import { CustomModal, DateTimePicker, InfoBox, Show } from '~/components/ui';
import { Input, ColorSelect, NumberInput } from '~/components/form';
import { useProductContext } from '~/context/product';
import { useTenantContext } from '~/context/tenant/useTenantContext';
import { useUpdateProductMutation } from '~/services/product/product.queries';
import { UpdateProductSchema, type UpdateProductInput } from '~/schema/updateProductSchema';
import theme from '~/theme';
import { formatCurrency } from '~/utils/number';

import { getProductTypeDisplayName } from './utils';

type EditProductModalProps = {
  open: boolean;
  onClose: () => void;
};

export const EditProductModal = ({ open, onClose }: EditProductModalProps) => {
  const { product } = useProductContext();
  const { tenantId } = useTenantContext();
  const { mutateAsync: updateProduct, isPending } = useUpdateProductMutation();

  const { control, handleSubmit, reset, formState, watch, setValue } = useForm<UpdateProductInput>({
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      effectiveFrom: dayjsLocal(product.scheduledPrice?.effectiveFrom).toISOString(),
      color: 'grey',
    },
    resolver: zodResolver(UpdateProductSchema),
  });

  const future = watch('future');

  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        description: product.description || '',
        price: product.productPrice?.price || 0,
        reading: product.productReading?.reading || 0,
        effectiveFrom: dayjsLocal(product.scheduledPrice?.effectiveFrom).toISOString(),
        color: product.color,
      });
    }
  }, [product, reset]);

  const onSubmit = async (data: UpdateProductInput) => {
    if (!tenantId || !product) return;

    try {
      await updateProduct({
        productId: product.id,
        tenantId,
        data: {
          name: data.name,
          description: data.description,
          productPrice: data.price,
          productReading: data.reading,
          color: data.color,
          ...(data.future && {
            effectiveFrom: new Date(data.effectiveFrom!).toISOString(),
          }),
        },
      });

      toast.success('Product updated successfully');
      onClose();
    } catch {
      toast.error('Failed to update product');
    }
  };
  const handleClose = () => {
    onClose();
    reset();
  };

  return (
    // TODO: disable submit button if form is invalid
    // invalid state is when the form is invalid and there are no changes (dirtyFields is empty)
    // this is to prevent submitting the form when there are no changes
    <CustomModal
      onSubmit={handleSubmit(onSubmit)}
      onClose={handleClose}
      open={open}
      title="Update Product"
      subheader="Edit an existing product details"
      submitText="Update"
      maxWidth={560}
      loading={isPending}
      icon={EditOutlined}
      disabled={!formState.isValid}
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
              <Typography variant="body2">
                Price set to change to{' '}
                <Typography variant="inherit" component="span" color="warning.main">
                  {formatCurrency(product.scheduledPrice.price)}
                </Typography>{' '}
                on{' '}
                <Typography variant="inherit" component="span" color="warning.main">
                  {formatDate(product.scheduledPrice.effectiveFrom, 'MMMM DD, YYYY hh:mm A')}
                </Typography>
              </Typography>
            </Stack>
          </InfoBox>
        )}
        <Stack flex={1} justifyContent="space-between" spacing={0.5}>
          <Typography variant="body2" color="textSecondary">
            Type
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
              alignItems: 'center',
            }}
          >
            <Typography variant="body2" fontWeight={500}>
              {getProductTypeDisplayName(product.type)}
            </Typography>
          </Box>
        </Stack>
        <Input
          label="Product Name"
          control={control}
          name="name"
          placeholder="e.g., Premium Diesel"
        />
        <Stack direction="row" spacing={1}>
          <NumberInput
            label="Current Reading"
            control={control}
            placeholder="0.00"
            name="reading"
            min={1}
            step={0.001}
          />
          <NumberInput
            label="Product Price"
            control={control}
            placeholder="0.00"
            name="price"
            min={1}
          />
        </Stack>
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
              checked={future}
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
                disablePast
                value={dayjsLocal(field.value)}
                onChange={(date) => field.onChange(date?.toISOString() ?? '')}
              />
            )}
          />
        </Show>
        
        <ColorSelect label="Color" control={control} name="color" />
        <Input
          label="Description (optional)"
          control={control}
          name="description"
          placeholder="Optional description"
          multiline
          rows={3}
        />
      </Stack>
    </CustomModal>
  );
};
