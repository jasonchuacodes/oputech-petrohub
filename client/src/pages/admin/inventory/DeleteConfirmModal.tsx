import { DeleteOutlined } from '@mui/icons-material';
import { Stack, Typography } from '@mui/material';
import toast from 'react-hot-toast';

import { CustomModal } from '~/components/ui';
import { useInventoryContext } from '~/context/inventory';
import { useTenantContext } from '~/context/tenant/useTenantContext';
import { useDeleteInventoryMutation } from '~/services/inventory/inventory.queries';

type DeleteConfirmModalProps = {
  open: boolean;
  onClose: () => void;
};

export const DeleteConfirmModal = ({ open, onClose }: DeleteConfirmModalProps) => {
  const { inventory } = useInventoryContext();
  const { tenantId } = useTenantContext();

  const { mutateAsync: deleteInventory } = useDeleteInventoryMutation();

  const handleConfirmDelete = async () => {
    if (!tenantId) return;

    try {
      await deleteInventory({ inventoryId: inventory.productId, tenantId });
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
              {inventory.productName}
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
