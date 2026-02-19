import { Stack } from '@mui/material';
import { zodResolver } from '@hookform/resolvers/zod';
import { AddOutlined } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { CustomModal } from '~/components/ui';
import { Input, NumberInput, ColorSelect, FormSelect } from '~/components/form';
import { useTenantContext } from '~/context/tenant/useTenantContext';
import { useCreateProductMutation } from '~/services/product/product.queries';
import { CreateProductSchema, type CreateProductInput } from '~/schema/createProductSchema';
import { ProductType } from '~/services/product/product.types';

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
      color: 'grey',
      type: ProductType.PREMIUM,
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
        color: data.color,
        type: data.type,
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
        <FormSelect
          label="Product Type"
          control={control}
          name="type"
          placeholder="Select product type"
          required
          options={[
            { label: 'Premium', value: ProductType.PREMIUM },
            { label: 'Unleaded', value: ProductType.GASOLINE },
            { label: 'Diesel', value: ProductType.DIESEL },
            { label: 'Kerosene', value: ProductType.KEROSENE },
          ]}
        />

        <Input
          required
          label="Product Name"
          control={control}
          name="name"
          placeholder="e.g., XTRA Unleaded"
        />

        <Stack direction="row" spacing={1}>
          <NumberInput
            required
            label="Current Reading"
            control={control}
            placeholder="0.00"
            name="reading"
            min={1}
          />
          <NumberInput
            required
            label="Product Price"
            control={control}
            placeholder="0.00"
            name="price"
            min={1}
          />
        </Stack>

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
