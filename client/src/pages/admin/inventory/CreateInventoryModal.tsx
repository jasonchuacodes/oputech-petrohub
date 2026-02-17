import { Stack } from '@mui/material';
import { zodResolver } from '@hookform/resolvers/zod';
import { AddOutlined } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { CustomModal } from '~/components/ui';
import { Input, NumberInput } from '~/components/form';
import { useTenantContext } from '~/context/tenant/useTenantContext';
import { useCreateInventoryMutation } from '~/services/inventory/inventory.queries';
import { CreateInventorySchema, type CreateInventoryInput } from '~/schema/createInventorySchema';

type CreateInventoryModalProps = {
  open: boolean;
  onClose: () => void;
};

export const CreateInventoryModal = ({ open, onClose }: CreateInventoryModalProps) => {
  const { tenantId } = useTenantContext();
  const { mutateAsync: createInventory, isPending } = useCreateInventoryMutation();

  const {
    control,
    handleSubmit,
    reset,
    formState: { isValid },
  } = useForm<CreateInventoryInput>({
    defaultValues: {
      name: '',
      description: '',
      quantity: 0,
      price: 0,
      lowStockThreshold: null,
    },
    resolver: zodResolver(CreateInventorySchema),
  });

  const onSubmit = async (data: CreateInventoryInput) => {
    if (!tenantId) return;

    try {
      await createInventory({
        tenantId,
        name: data.name,
        description: data.description,
        price: data.price,
        quantity: data.quantity,
        // TODO: apply lowstockthreshhold
        lowStockThreshold: data.lowStockThreshold,
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
        <Stack direction="row" spacing={1}>
          <NumberInput
            label="Quantity"
            control={control}
            placeholder="Enter quantity"
            name="quantity"
            step={1}
            min={0}
          />
          <NumberInput
            label="Price"
            control={control}
            placeholder="Enter price"
            name="price"
            step={1.0}
            min={1.0}
            startAdornment="₱"
          />
        </Stack>
        <NumberInput
          label="Low Stock Threshold (optional)"
          control={control}
          placeholder="Set threshold for low stock alert"
          name="lowStockThreshold"
          step={1}
          min={1}
          helperText="Alert will show when quantity is at or below this value"
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
