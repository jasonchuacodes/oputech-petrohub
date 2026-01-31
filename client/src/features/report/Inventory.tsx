import { AddOutlined, EditOutlined, RemoveOutlined } from '@mui/icons-material';
import { Stack, Typography, IconButton, Divider } from '@mui/material';
import { useState } from 'react';
import toast from 'react-hot-toast';

import { Button, CardContainer, Show } from '~/components/ui';
import { useDisclosure } from '~/hooks/useDisclosure';
import {
  useUpdateInventoryMutation,
  useDeleteInventoryMutation,
} from '~/services/report/report.queries';
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
  const [isEditMode, setIsEditMode] = useState(false);
  const inventoryDisclosure = useDisclosure();
  const { mutateAsync: updateInventory } = useUpdateInventoryMutation();
  const { mutateAsync: deleteInventory } = useDeleteInventoryMutation();

  const handleDecrement = async (item: ReportInventory) => {
    try {
      const newQuantity = item.quantity - 1;

      if (newQuantity === 0) {
        await deleteInventory({ reportId, productId: item.productId });
        toast.success('Inventory item removed');
      } else {
        await updateInventory({
          reportId,
          productId: item.productId,
          data: { quantity: newQuantity },
        });
      }
    } catch {
      toast.error('Failed to update inventory item');
    }
  };

  return (
    <Stack spacing={0.5}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="body1" fontWeight={600} color="text.primary">
          Lubricants
        </Typography>
        {!isReadOnly && (
          <IconButton  size="small"  onClick={() => setIsEditMode(!isEditMode)}>
            <EditOutlined />
          </IconButton>
        )}
      </Stack>

      <CardContainer height="fit-content" spacing={2}>
        {inventories.length > 0 && (
          <Stack spacing={1}>
            {/* Header Row */}
            <Stack direction="row" alignItems="center">
              <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>
                Name
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
              {isEditMode && (
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
                  {formatNumber(item.amount, 2)}
                </Typography>

                {isEditMode && (
                  <IconButton size="small" onClick={() => handleDecrement(item)}>
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
