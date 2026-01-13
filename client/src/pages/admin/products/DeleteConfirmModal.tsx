import { DeleteOutlined } from '@mui/icons-material';
import { Stack, Typography } from '@mui/material';
import toast from 'react-hot-toast';

import { CustomModal } from '~/components/ui';
import { useProductContext } from '~/context/product';
import { useTenantContext } from '~/context/tenant/useTenantContext';
import { useDeleteProductMutation } from '~/services/product/product.queries';

type DeleteConfirmModalProps = {
  open: boolean;
  onClose: () => void;
};

export const DeleteConfirmModal = ({ open, onClose }: DeleteConfirmModalProps) => {
  const { product } = useProductContext();
  const { tenantId } = useTenantContext();

  const { mutateAsync: deleteProduct } = useDeleteProductMutation();

  const handleConfirmDelete = async () => {
    if (!tenantId) return;

    try {
      await deleteProduct({ productId: product.id, tenantId });
      toast.success('Product deleted successfully');
      onClose();
    } catch {
      toast.error('Cannot delete product. It may be referenced in reports.');
    }
  };

  return (
    <CustomModal
      onSubmit={handleConfirmDelete}
      onClose={onClose}
      open={open}
      type="danger"
      title="Delete Product Confirmation"
      subheader={
        <Stack spacing={1}>
          <Typography variant="body2">
            Are you sure you want to delete{' '}
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
