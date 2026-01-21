import { Stack } from '@mui/material';
import { zodResolver } from '@hookform/resolvers/zod';
import { AddOutlined } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { CustomModal } from '~/components/ui';
import { Input } from '~/components/form';
import { useTenantContext } from '~/context/tenant/useTenantContext';
import { useCreateStockInventoryMutation } from '~/services/inventory/inventory.queries';
import { CreateStockInventorySchema, type CreateStockInventoryInput } from '~/schema/createStockInventorySchema';

type CreateStockInventoryModalProps = {
  open: boolean;
  onClose: () => void;
};

export const CreateStockInventoryModal = ({ open, onClose }: CreateStockInventoryModalProps) => {
  const { tenantId } = useTenantContext();
  const { mutateAsync: createStockInventory, isPending } = useCreateStockInventoryMutation();

  const {
    control,
    handleSubmit,
    reset,
    formState: { isValid },
  } = useForm<CreateStockInventoryInput>({
    defaultValues: {
      name: '',
      description: '',
      quantity: 0,
    },
    resolver: zodResolver(CreateStockInventorySchema),
  });

  const onSubmit = async (data: CreateStockInventoryInput) => {
    if (!tenantId) return;
    try {
      await createStockInventory({
        tenantId,
        name: data.name,
        description: data.description,
        price: data.price,
        quantity: data.quantity,
      });
      toast.success('Stock inventory created successfully');
      reset();
      onClose();
    } catch {
      toast.error('Failed to create stock inventory');
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
      title="Create Stock Inventory"
      subheader="Add a new inventory item."
      submitText="Create Item"
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
          placeholder="e.g., Mobil 1 Lubricant"
        />
        <Input
          label="Quantity"
          control={control}
          name="quantity"
          type="number"
          placeholder="0"
          slotProps={{
            input: { step: '1', min: '0' },
          }}
        />
        <Input
          label="Price"
          control={control}
          name="price"
          type="number"
          startAdornment="₱"
          placeholder="0.00"
          slotProps={{
            input: { step: '0.01', min: '0.01' },
          }}
        />
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
