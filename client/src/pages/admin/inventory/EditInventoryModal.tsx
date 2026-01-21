import { EditOutlined } from '@mui/icons-material';
import { Stack } from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

import { CustomModal } from '~/components/ui';
import { Input } from '~/components/form';
import { useInventoryContext } from '~/context/inventory';
import { useTenantContext } from '~/context/tenant/useTenantContext';
import { useUpdateInventoryMutation } from '~/services/inventory/inventory.queries';
import { UpdateInventorySchema, type UpdateInventoryInput } from '~/schema/updateInventorySchema';

type EditInventoryModalProps = {
  open: boolean;
  onClose: () => void;
};

export const EditInventoryModal = ({ open, onClose }: EditInventoryModalProps) => {
  const { inventory } = useInventoryContext();
  const { tenantId } = useTenantContext();
  const { mutateAsync: updateInventory, isPending } = useUpdateInventoryMutation();

  const { control, handleSubmit, reset, formState } = useForm<UpdateInventoryInput>({
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      quantity: 0,
    },
    resolver: zodResolver(UpdateInventorySchema),
  });

  useEffect(() => {
    if (inventory) {
      reset({
        name: inventory.productName,
        description: inventory.productDescription || '',
        price: inventory.currentPrice || 0,
        quantity: inventory.quantity,
      });
    }
  }, [inventory, reset]);

  const onSubmit = async (data: UpdateInventoryInput) => {
    if (!tenantId || !inventory) return;

    try {
      await updateInventory({
        inventoryId: inventory.productId,
        tenantId,
        data: {
          name: data.name,
          description: data.description,
          price: data.price,
          quantity: data.quantity,
        },
      });

      toast.success('Stock inventory updated successfully');
      onClose();
    } catch {
      toast.error('Failed to update stock inventory');
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
      title="Update Stock Inventory"
      subheader="Edit inventory item details"
      submitText="Update"
      maxWidth={560}
      loading={isPending}
      icon={EditOutlined}
      disabled={!formState.isValid}
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
          step="1"
          min="0"
        />
        <Input
          label="Price"
          control={control}
          name="price"
          startAdornment="₱"
          type="number"
          placeholder="0.00"
          step="0.01"
          min="0.01"
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
