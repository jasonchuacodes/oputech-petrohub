import { Box, Stack, Typography } from '@mui/material';
import { zodResolver } from '@hookform/resolvers/zod';
import { AddOutlined } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { CustomModal } from '~/components/ui';
import { NumberInput } from '~/components/form';
import { FormSelect } from '~/components/form/FormSelect';
import { useAuthContext } from '~/context/auth/useAuthContext';
import { useCreateInventoryMutation } from '~/services/report/report.queries';
import { useGetProductsQuery } from '~/services/product/product.queries';
import { ProductCategory } from '~/services/product/product.types';
import {
  CreateReportInventorySchema,
  type CreateReportInventoryInput,
} from '~/schema/createReportInventorySchema';
import { formatNumber } from '~/utils/number';

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
    watch,
    formState: { isValid },
  } = useForm<CreateReportInventoryInput>({
    defaultValues: {
      productId: '',
      quantity: 1,
    },
    resolver: zodResolver(CreateReportInventorySchema),
  });

  const selectedProductId = watch('productId');
  const selectedProduct = products.find((p) => p.id === selectedProductId);

  const quantity = watch('quantity');

  const onSubmit = async (data: CreateReportInventoryInput) => {
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
        <Box>
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
          />
        </Box>

        <Stack direction="row" spacing={1}>
          <NumberInput
            label="Quantity"
            control={control}
            placeholder="Enter quantity sold"
            name="quantity"
            step={1}
            min={1}
            fullWidth={false}
            width="50%"
          />
          <Stack flex={1} justifyContent="space-between" spacing={0.5} width="50%">
            <Typography variant="body2" color="textSecondary">
              Price{' '}
              {selectedProduct && (
                <Typography variant="body2" component="span" color="warning.main">
                  @ {formatNumber(selectedProduct.productPrice.price)}
                </Typography>
              )}
            </Typography>
            <Box
              sx={{
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                height: 48,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  borderRight: '1px solid',
                  borderColor: 'divider',
                  alignItems: 'center',
                  alignSelf: 'stretch',
                  px: 2,
                  mr: 2,
                }}
              >
                <Typography variant="body1" color="text.secondary">
                  ₱
                </Typography>
              </Box>
              <Typography variant="body1" color="text.secondary">
                {selectedProduct ? formatNumber(selectedProduct.productPrice.price * quantity) : 0}
              </Typography>
            </Box>
          </Stack>
        </Stack>
      </Stack>
    </CustomModal>
  );
};
