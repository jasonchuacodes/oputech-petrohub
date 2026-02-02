import { DeleteOutlined } from '@mui/icons-material';
import { Stack, Typography } from '@mui/material';
import toast from 'react-hot-toast';

import { CustomModal } from '~/components/ui';
import { useProductContext } from '~/context/product';
import { useTenantContext } from '~/context/tenant/useTenantContext';
import { useDeactivateProductMutation } from '~/services/product/product.queries';

type DeleteConfirmModalProps = {
  open: boolean;
  onClose: () => void;
};

export const DeleteConfirmModal = ({ open, onClose }: DeleteConfirmModalProps) => {
  const { product } = useProductContext();
  const { tenantId } = useTenantContext();

  const { mutateAsync: deactivateProduct } = useDeactivateProductMutation();

  const handleConfirmDelete = async () => {
    if (!tenantId) return;

    try {
      await deactivateProduct({ productId: product.id, tenantId });
      toast.success('Product deactivated successfully');
      onClose();
    } catch {
      toast.error('Failed to deactivate product.');
    }
  };

  return (
    <CustomModal
      onSubmit={handleConfirmDelete}
      onClose={onClose}
      open={open}
      type="danger"
      title="Deactivate Product Confirmation"
      subheader={
        <Stack spacing={1}>
          <Typography variant="body2">
            Are you sure you want to deactivate{' '}
            <Typography variant="inherit" component="span" color="warning.main">
              {product.name}
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
