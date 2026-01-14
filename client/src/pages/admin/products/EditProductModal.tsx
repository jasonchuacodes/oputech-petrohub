import { EditOutlined } from '@mui/icons-material';
import { Checkbox, FormControlLabel, Stack } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { dayjsLocal } from '~/utils/date';
import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';

import { CustomModal, DateTimePicker, Show } from '~/components/ui';
import { Input } from '~/components/form';
import { useProductContext } from '~/context/product';
import { useTenantContext } from '~/context/tenant/useTenantContext';
import { useUpdateProductMutation } from '~/services/product/product.queries';
import { CreateProductSchema, type CreateProductInput } from '~/schema/createProductSchema';

type EditProductModalProps = {
  open: boolean;
  onClose: () => void;
};

export const EditProductModal = ({ open, onClose }: EditProductModalProps) => {
  const { product } = useProductContext();
  const { tenantId } = useTenantContext();
  const { mutateAsync: updateProduct, isPending } = useUpdateProductMutation();

  const [future, setFuture] = useState(!!product.scheduledPrice);

  const { control, handleSubmit, reset } = useForm<CreateProductInput>({
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      effectiveFrom: dayjsLocal(product.scheduledPrice?.effectiveFrom).toISOString(),
    },
    resolver: zodResolver(CreateProductSchema),
  });

  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        description: product.description || '',
        price: product.productPrice?.price || 0,
        reading: product.productReading?.reading || 0,
        effectiveFrom: dayjsLocal(product.scheduledPrice?.effectiveFrom).toISOString(),
      });
    }
  }, [product, reset]);

  const onSubmit = async (data: CreateProductInput) => {
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
          ...(future &&
            data.effectiveFrom && { effectiveFrom: new Date(data.effectiveFrom).toISOString() }),
        },
      });
      toast.success('Product updated successfully');
      onClose();
    } catch {
      toast.error('Failed to update product');
    }
  };

  const handleClose = () => {
    onClose()
    reset()
  }

  return (
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
    >
      <Stack spacing={2}>
        <Input
          label="Product Name"
          control={control}
          name="name"
          placeholder="e.g., Premium Diesel"
        />
        <Input
          label="Current Reading"
          control={control}
          name="reading"
          type="number"
          placeholder="0.00"
          slotProps={{
            input: { step: '0.01', min: '0.01' },
          }}
        />
        <Input
          label="Product Price"
          control={control}
          name="price"
          startAdornment="₱"
          type="number"
          placeholder="0.00"
          slotProps={{
            input: { step: '0.01', min: '0.01' },
          }}
        />
        <FormControlLabel
          sx={{
            width: 'fit-content',
            '& .MuiFormControlLabel-label': {
              fontSize: 'body2.fontSize',
              ml: 0.5,
            },
          }}
          control={<Checkbox checked={future} onChange={() => setFuture(!future)} sx={{ p: 0 }} />}
          label="Schedule price change?"
        />
        <Show when={future} fallback={null}>
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
