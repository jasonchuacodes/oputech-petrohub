import { EditOutlined } from '@mui/icons-material';
import { Stack } from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

import { CustomModal } from '~/components/ui';
import { Input } from '~/components/form';
import { useStockInventoryContext } from '~/context/stock-inventory';
import { useTenantContext } from '~/context/tenant/useTenantContext';
import { useUpdateStockInventoryMutation } from '~/services/inventory/inventory.queries';
import { UpdateStockInventorySchema, type UpdateStockInventoryInput } from '~/schema/updateStockInventorySchema';

type EditStockInventoryModalProps = {
  open: boolean;
  onClose: () => void;
};

export const EditStockInventoryModal = ({ open, onClose }: EditStockInventoryModalProps) => {
  const { stockInventory } = useStockInventoryContext();
  const { tenantId } = useTenantContext();
  const { mutateAsync: updateStockInventory, isPending } = useUpdateStockInventoryMutation();

  const { control, handleSubmit, reset, formState } = useForm<UpdateStockInventoryInput>({
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      quantity: 0,
    },
    resolver: zodResolver(UpdateStockInventorySchema),
  });

  useEffect(() => {
    if (stockInventory) {
      reset({
        name: stockInventory.productName,
        description: stockInventory.productDescription || '',
        price: stockInventory.currentPrice || 0,
        quantity: stockInventory.quantity,
      });
    }
  }, [stockInventory, reset]);

  const onSubmit = async (data: UpdateStockInventoryInput) => {
    if (!tenantId || !stockInventory) return;

    try {
      await updateStockInventory({
        inventoryId: stockInventory.productId,
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
          slotProps={{
            input: { step: '1', min: '0' },
          }}
        />
        <Input
          label="Price"
          control={control}
          name="price"
          startAdornment="₱"
          type="number"
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
