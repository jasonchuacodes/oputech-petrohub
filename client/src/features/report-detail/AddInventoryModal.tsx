import { Stack } from '@mui/material';
import { zodResolver } from '@hookform/resolvers/zod';
import { AddOutlined } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { CustomModal } from '~/components/ui';
import { Input } from '~/components/form';
import { FormSelect } from '~/components/form/FormSelect';
import { useCreateInventoryMutation } from '~/services/report/report.queries';
import { useGetProductsQuery } from '~/services/product/product.queries';
import { ProductCategory } from '~/services/product/product.types';
import { CreateInventorySchema, type CreateInventoryInput } from '~/schema/createInventorySchema';
import { useAuthContext } from '~/context/auth/useAuthContext';

type AddInventoryModalProps = {
  open: boolean;
  onClose: () => void;
  reportId: string;
};

export const AddInventoryModal = ({ open, onClose, reportId }: AddInventoryModalProps) => {
  const { auth } = useAuthContext();
  const tenantId = auth?.tenantId;

  const { data: products = [] } = useGetProductsQuery(tenantId, ProductCategory.STOCK_INVENTORY);
  const { mutateAsync: createInventory, isPending } = useCreateInventoryMutation();

  const {
    control,
    handleSubmit,
    reset,
    formState: { isValid },
  } = useForm<CreateInventoryInput>({
    defaultValues: {
      productId: '',
      quantity: 1,
    },
    resolver: zodResolver(CreateInventorySchema),
  });

  const onSubmit = async (data: CreateInventoryInput) => {
    try {
      await createInventory({
        reportId,
        data: {
          productId: data.productId,
          quantity: data.quantity,
        },
      });
      toast.success('Inventory item added successfully');
      reset();
      onClose();
    } catch {
      toast.error('Failed to add inventory item');
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
      title="Add Inventory Item"
      subheader="Record a new inventory sale for this report."
      submitText="Add Inventory"
      loading={isPending}
      maxWidth={560}
      icon={AddOutlined}
      disabled={!isValid}
    >
      <Stack spacing={2}>
        <FormSelect
          label="Product"
          control={control}
          name="productId"
          options={products.map((product) => ({
            label: product.name,
            value: product.id,
          }))}
          placeholder="Select a product"
          displayEmpty
          required
        />
        <Input
          label="Quantity"
          control={control}
          placeholder='Enter quantity sold'
          name="quantity"
          type="number"
          step="1"
          min="0"
        />
      </Stack>
    </CustomModal>
  );
};
