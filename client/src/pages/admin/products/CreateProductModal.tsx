import { Stack } from '@mui/material';
import { zodResolver } from '@hookform/resolvers/zod';
import { AddOutlined } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { CustomModal } from '~/components/ui';
import { Input, NumberInput } from '~/components/form';
import { useTenantContext } from '~/context/tenant/useTenantContext';
import { useCreateProductMutation } from '~/services/product/product.queries';
import { CreateProductSchema, type CreateProductInput } from '~/schema/createProductSchema';

type CreateProductModalProps = {
  open: boolean;
  onClose: () => void;
};

export const CreateProductModal = ({ open, onClose }: CreateProductModalProps) => {
  const { tenantId } = useTenantContext();
  const { mutateAsync: createProduct, isPending } = useCreateProductMutation();

  const {
    control,
    handleSubmit,
    reset,
    formState: { isValid },
  } = useForm<CreateProductInput>({
    defaultValues: {
      name: '',
      description: '',
    },
    resolver: zodResolver(CreateProductSchema),
  });

  const onSubmit = async (data: CreateProductInput) => {
    if (!tenantId) return;
    try {
      await createProduct({
        tenantId,
        name: data.name,
        description: data.description,
        price: data.price,
        reading: data.reading,
      });
      toast.success('Product created successfully');
      reset();
      onClose();
    } catch {
      toast.error('Failed to create product');
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
      title="Create Product"
      subheader="Add a new product to your inventory."
      submitText="Create Product"
      loading={isPending}
      maxWidth={560}
      icon={AddOutlined}
      disabled={!isValid}
    >
      <Stack spacing={2}>
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
            step={1}
            min={1}
          />
          <NumberInput
            label="Product Price"
            control={control}
            placeholder="0.00"
            name="price"
            step={1}
            min={1}
          />
        </Stack>

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
