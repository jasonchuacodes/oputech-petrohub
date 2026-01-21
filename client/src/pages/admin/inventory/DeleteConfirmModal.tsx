import { DeleteOutlined } from '@mui/icons-material';
import { Stack, Typography } from '@mui/material';
import toast from 'react-hot-toast';

import { CustomModal } from '~/components/ui';
import { useStockInventoryContext } from '~/context/stock-inventory';
import { useTenantContext } from '~/context/tenant/useTenantContext';
import { useDeleteStockInventoryMutation } from '~/services/inventory/inventory.queries';

type DeleteConfirmModalProps = {
  open: boolean;
  onClose: () => void;
};

export const DeleteConfirmModal = ({ open, onClose }: DeleteConfirmModalProps) => {
  const { stockInventory } = useStockInventoryContext();
  const { tenantId } = useTenantContext();

  const { mutateAsync: deleteStockInventory } = useDeleteStockInventoryMutation();

  const handleConfirmDelete = async () => {
    if (!tenantId) return;

    try {
      await deleteStockInventory({ inventoryId: stockInventory.productId, tenantId });
      toast.success('Stock inventory deleted successfully');
      onClose();
    } catch {
      toast.error('Cannot delete item. It may be referenced in reports.');
    }
  };

  return (
    <CustomModal
      onSubmit={handleConfirmDelete}
      onClose={onClose}
      open={open}
      type="danger"
      title="Delete Inventory Item"
      subheader={
        <Stack spacing={1}>
          <Typography variant="body2">
            Are you sure you want to delete{' '}
            <Typography variant="inherit" component="span" color="warning.main">
              {stockInventory.productName}
            </Typography>
            ?
          </Typography>
        </Stack>
      }
      submitText="Delete"
      maxWidth={560}
      icon={DeleteOutlined}
    />
  );
};
