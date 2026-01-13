import { Stack, Typography } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';

import { CustomModal } from '~/components/ui';
import { Input } from '~/components/form';
import { useTenantContext } from '~/context/tenant/useTenantContext';
import { useCreateProductMutation } from '~/services/product/product.queries';
import { CreateProductSchema, type CreateProductInput } from '~/schema/createProductSchema';
import { AddOutlined } from '@mui/icons-material';
import { useEffect } from 'react';

type CreateProductModalProps = {
  open: boolean;
  onClose: () => void;
};

export const CreateProductModal = ({ open, onClose }: CreateProductModalProps) => {
  const { tenantId } = useTenantContext();
  const { mutateAsync: createProduct, isPending } = useCreateProductMutation();

  const { control, handleSubmit, reset, formState } = useForm<CreateProductInput>({
    defaultValues: {
      name: '',
      description: '',
      productPrice: 0,
      effectiveFrom: new Date().toISOString().slice(0, 16),
    },
    resolver: zodResolver(CreateProductSchema),
  });

  const onSubmit = async (data: CreateProductInput) => {
    if (!tenantId) return;
    try {
      const effectiveFrom = data.effectiveFrom
        ? new Date(data.effectiveFrom).toISOString()
        : new Date().toISOString();
      await createProduct({
        tenantId,
        name: data.name,
        description: data.description,
        productPrice: data.productPrice,
        effectiveFrom,
      });
      toast.success('Product created successfully');
      reset();
      onClose();
    } catch {
      toast.error('Failed to create product');
    }
  };

  useEffect(() => {
    console.log("ERRORS:", formState.errors)
  }, [formState.errors])

  return (
    <CustomModal
      open={open}
      onClose={onClose}
      onSubmit={handleSubmit(onSubmit)}
      title="Create Product"
      subheader="Add a new product to your inventory."
      submitText="Create Product"
      loading={isPending}
      maxWidth={560}
      icon={AddOutlined}
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
            slotProps={{
              input: { step: '0.01', min: '0.01' }
            }}
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
