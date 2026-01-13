import { EditOutlined } from '@mui/icons-material';
import { Stack, Typography } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { useEffect } from 'react';

import { CustomModal } from '~/components/ui';
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

  const { control, handleSubmit, reset } = useForm<CreateProductInput>({
    defaultValues: {
      name: '',
      description: '',
      productPrice: 0,
      effectiveFrom: '',
    },
    resolver: zodResolver(CreateProductSchema),
  });

  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        description: product.description || '',
        productPrice: product.productPrice?.price || 0,
        effectiveFrom: product.productPrice?.effectiveFrom
          ? new Date(product.productPrice.effectiveFrom).toISOString().slice(0, 16)
          : new Date().toISOString().slice(0, 16),
      });
    }
  }, [product, reset]);

  const onSubmit = async (data: CreateProductInput) => {
    if (!tenantId || !product) return;
    try {
      const effectiveFrom = data.effectiveFrom
        ? new Date(data.effectiveFrom).toISOString()
        : new Date().toISOString();
      await updateProduct({
        productId: product.id,
        tenantId,
        data: {
          name: data.name,
          description: data.description,
          productPrice: data.productPrice,
          effectiveFrom,
        },
      });
      toast.success('Product updated successfully');
      onClose();
    } catch {
      toast.error('Failed to update product');
    }
  };

  return (
    <CustomModal
      onSubmit={handleSubmit(onSubmit)}
      onClose={onClose}
      open={open}
      title="Update Product"
      subheader="Edit an existing product."
      submitText="Update"
      maxWidth={560}
      loading={isPending}
      icon={EditOutlined}
    >
      <Stack spacing={2}>
        <Stack spacing={0.5}>
          <Typography variant="body2" fontWeight="medium">
            Product Name
          </Typography>
          <Input control={control} name="name" placeholder="e.g., Premium Diesel" />
        </Stack>

        <Stack spacing={0.5}>
          <Typography variant="body2" fontWeight="medium">
            Description
          </Typography>
          <Input
            control={control}
            name="description"
            placeholder="Optional description"
            multiline
            rows={2}
          />
        </Stack>

        <Stack spacing={0.5}>
          <Typography variant="body2" fontWeight="medium">
            Product Price
          </Typography>
          <Input
            control={control}
            name="productPrice"
            type="number"
            placeholder="0.00"
          />
        </Stack>

        <Stack spacing={0.5}>
          <Typography variant="body2" fontWeight="medium">
            Effective From
          </Typography>
          <Controller
            name="effectiveFrom"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="datetime-local"
                style={{
                  padding: '12px',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                }}
              />
            )}
          />
        </Stack>
      </Stack>
    </CustomModal>
  );
};
