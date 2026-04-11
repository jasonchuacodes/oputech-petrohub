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
import { dayjsLocal, formatDate } from '~/utils/date';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { Button, CustomModal, DateTimePicker, InfoBox, Show } from '~/components/ui';
import { Input, ColorSelect, NumberInput } from '~/components/form';
import { useProductContext } from '~/context/product';
import { useTenantContext } from '~/context/tenant/useTenantContext';
import {
  useUpdateProductMutation,
  useUpdateProductTypePriceMutation,
  useCancelScheduledPriceMutation,
} from '~/services/product/product.queries';
import { UpdateProductSchema, type UpdateProductInput } from '~/schema/updateProductSchema';
import {
  UpdateProductTypePriceSchema,
  type UpdateProductTypePriceInput,
} from '~/schema/updateProductTypePriceSchema';
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
  const [view, setView] = useState<'details' | 'price'>('details');

  const { mutateAsync: updateProduct, isPending } = useUpdateProductMutation();
  const { mutateAsync: updateProductTypePrice, isPending: isPriceUpdatePending } =
    useUpdateProductTypePriceMutation();
  const { mutateAsync: cancelScheduledPrice, isPending: isCancelling } =
    useCancelScheduledPriceMutation();

  const {
    control: detailsControl,
    handleSubmit: handleDetailsSubmit,
    reset: resetDetails,
    formState: detailsFormState,
  } = useForm<UpdateProductInput>({
    defaultValues: {
      name: '',
      description: '',
      reading: 0,
      color: 'grey',
    },
    resolver: zodResolver(UpdateProductSchema),
  });

  const {
    control: priceControl,
    handleSubmit: handlePriceSubmit,
    reset: resetPrice,
    formState: priceFormState,
    watch: watchPrice,
    setValue: setPriceValue,
  } = useForm<UpdateProductTypePriceInput>({
    defaultValues: {
      productPrice: 0,
      effectiveFrom: dayjsLocal(product.scheduledPrice?.effectiveFrom).toISOString(),
      future: false,
    },
    resolver: zodResolver(UpdateProductTypePriceSchema),
  });

  const future = watchPrice('future');

  useEffect(() => {
    if (product) {
      resetDetails({
        name: product.name,
        description: product.description || '',
        reading: product.productReading?.reading || 0,
        color: product.color,
      });
      resetPrice({
        productPrice: product.productPrice?.price || 0,
        effectiveFrom: dayjsLocal(product.scheduledPrice?.effectiveFrom).toISOString(),
        future: false,
      });
    }
  }, [product, resetDetails, resetPrice]);

  const onDetailsSubmit = async (data: UpdateProductInput) => {
    if (!tenantId || !product) return;

    try {
      await updateProduct({
        productId: product.id,
        tenantId,
        data: {
          name: data.name,
          description: data.description,
          productReading: data.reading,
          color: data.color,
        },
      });

      toast.success('Product updated successfully');
      onClose();
    } catch {
      toast.error('Failed to update product');
    }
  };

  const onPriceSubmit = async (data: UpdateProductTypePriceInput) => {
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
      setView('details');
      onClose();
    } catch {
      toast.error('Failed to update fuel price');
    }
  };

  const handleClose = () => {
    onClose();
    resetDetails();
    resetPrice();
    setView('details');
  };

  const isDetailsView = view === 'details';

  return (
    <CustomModal
      onCancel={!isDetailsView ? () => setView('details') : onClose}
      onSubmit={
        isDetailsView ? handleDetailsSubmit(onDetailsSubmit) : handlePriceSubmit(onPriceSubmit)
      }
      onClose={handleClose}
      open={open}
      title={isDetailsView ? 'Update Product' : 'Update Price'}
      subheader={
        isDetailsView
          ? 'Edit an existing product details'
          : 'Change the price for all products of this type'
      }
      submitText="Update"
      maxWidth={560}
      loading={isDetailsView ? isPending : isPriceUpdatePending}
      icon={EditOutlined}
      disabled={
        isDetailsView
          ? !detailsFormState.isValid || !detailsFormState.isDirty
          : !priceFormState.isValid || !priceFormState.isDirty
      }
    >
      {isDetailsView ? (
        <Stack spacing={2}>
          <Stack spacing={0.5} alignItems="start">
            <Typography variant="body2" color="text.primary" fontWeight={500}>
              Product Type
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
          <Input
            label="Product Name"
            control={detailsControl}
            name="name"
            placeholder="e.g., Premium Diesel"
          />
          <Stack direction="row" spacing={1} alignItems="end">
            <Box flex={1}>
              <NumberInput
                label="Current Reading"
                control={detailsControl}
                placeholder="0.00"
                name="reading"
                min={1}
                step={0.001}
              />
            </Box>
            <Stack direction="row" alignItems="end" flex={1}>
              <Stack spacing={0.5} alignItems="start" flex={1}>
                <Typography variant="body2" color="text.primary" fontWeight={500}>
                  Product Price
                </Typography>
                <Box
                  sx={{
                    borderRadius: '8px 0 0 8px',
                    border: '1px solid',
                    borderRight: 'none',
                    borderColor: 'divider',
                    bgcolor: alpha(theme.palette.grey[100], 0.8),
                    px: 1.5,
                    py: 0.5,
                    height: 40,
                    display: 'flex',
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Typography variant="body2">
                    {formatCurrency(product.productPrice?.price ?? 0)}
                  </Typography>
                </Box>
              </Stack>
              <Button
                variant="outlined"
                size="small"
                sx={{ borderRadius: '0 8px 8px 0' }}
                onClick={() => setView('price')}
              >
                Update
              </Button>
            </Stack>
          </Stack>
          <ColorSelect label="Color" control={detailsControl} name="color" />
          <Input
            label="Description (optional)"
            control={detailsControl}
            name="description"
            placeholder="Optional description"
            multiline
            rows={3}
          />
        </Stack>
      ) : (
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
            control={priceControl}
            placeholder="0.00"
            name="productPrice"
            startAdornment="₱"
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
                onChange={(e) =>
                  setPriceValue('future', e.target.checked, { shouldValidate: true })
                }
                sx={{ p: 0 }}
              />
            }
            label="Schedule price change?"
          />

          <Show when={!!future} fallback={null}>
            <Controller
              name="effectiveFrom"
              control={priceControl}
              render={({ field }) => (
                <DateTimePicker
                  value={dayjsLocal(field.value)}
                  onChange={(date) => field.onChange(date?.toISOString() ?? '')}
                />
              )}
            />
          </Show>
        </Stack>
      )}
    </CustomModal>
  );
};
