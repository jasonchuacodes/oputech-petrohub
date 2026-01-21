import { AddOutlined, MoreHorizOutlined, RemoveOutlined } from '@mui/icons-material';
import { Stack, Typography, IconButton, Divider } from '@mui/material';
import toast from 'react-hot-toast';

import { Button, CardContainer, Show } from '~/components/ui';
import { useDisclosure } from '~/hooks/useDisclosure';
import { useDeleteInventoryMutation } from '~/services/report/report.queries';
import type { ReportInventory } from '~/services/report/report.types';
import { formatCurrency, formatNumber } from '~/utils/number';

import { AddInventoryModal } from './AddInventoryModal';

type InventoryProps = {
  reportId: string;
  inventories: ReportInventory[];
  totalInventorySales: number;
  isReadOnly: boolean;
};

export const Inventory = ({
  reportId,
  inventories,
  totalInventorySales,
  isReadOnly,
}: InventoryProps) => {
  const inventoryDisclosure = useDisclosure();
  const { mutateAsync: deleteInventory } = useDeleteInventoryMutation();

  const handleDelete = async (productId: string) => {
    try {
      await deleteInventory({ reportId, productId });
      toast.success('Inventory item deleted successfully');
    } catch {
      toast.error('Failed to delete inventory item');
    }
  };

  return (
    <Stack>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="body1" fontWeight={600} color="text.primary">
          Inventory
        </Typography>
        <IconButton>
          <MoreHorizOutlined />
        </IconButton>
      </Stack>

      <CardContainer height="fit-content" spacing={2}>
        {inventories.length > 0 && (
          <Stack spacing={1}>
            {/* Header Row */}
            <Stack direction="row" alignItems="center">
              <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>
                Product
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ width: 80, textAlign: 'right' }}
              >
                Quantity
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ width: 100, textAlign: 'right' }}
              >
                Amount
              </Typography>
              {!isReadOnly && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ width: 40, textAlign: 'right' }}
                />
              )}
            </Stack>

            {/* Data Rows */}
            {inventories.map((item) => (
              <Stack key={item.id} direction="row" alignItems="center" spacing={1}>
                <Typography variant="body2" sx={{ flex: 1 }}>
                  {item.product.name}
                </Typography>
                <Typography variant="body2" sx={{ width: 80, textAlign: 'right' }}>
                  {formatNumber(item.quantity, 0)}
                </Typography>
                <Typography variant="body2" sx={{ width: 100, textAlign: 'right' }}>
                  {formatNumber(item.totalPrice, 2)}
                </Typography>
                
                {!isReadOnly && (
                  <IconButton
                    size="small"
                    onClick={() => handleDelete(item.productId)}
                    sx={{ width: 40 }}
                  >
                    <RemoveOutlined fontSize="small" />
                  </IconButton>
                )}
              </Stack>
            ))}

            {/* Total Row */}
            <Show when={inventories.length > 1}>
              <Divider />
              <Stack direction="row" alignItems="center">
                <Typography variant="body2" sx={{ flex: 1 }}>
                  Total
                </Typography>
                <Typography variant="body2" sx={{ width: 80 }} />
                <Typography variant="body2" sx={{ width: 100, textAlign: 'right' }}>
                  {formatCurrency(totalInventorySales)}
                </Typography>
                {!isReadOnly && <Typography variant="body2" sx={{ width: 40 }} />}
              </Stack>
            </Show>
          </Stack>
        )}

        <Show when={!isReadOnly}>
          <Button
            onClick={() => inventoryDisclosure.setOpen(true)}
            variant="outlined"
            startIcon={<AddOutlined />}
          >
            <Typography>Add Inventory Item</Typography>
          </Button>
        </Show>

        <AddInventoryModal
          open={inventoryDisclosure.open}
          onClose={() => inventoryDisclosure.setOpen(false)}
          reportId={reportId}
        />
      </CardContainer>
    </Stack>
  );
};
