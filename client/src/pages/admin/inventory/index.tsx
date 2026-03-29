import { useState } from 'react';
import { Stack, Typography } from '@mui/material';
import { HomeOutlined, AddOutlined } from '@mui/icons-material';

import { PageHeader } from '~/components/layouts';
import { Breadcrumb, Button, Chip, DataTable, PageContainer, PageLayout } from '~/components/ui';
import { InventoryProvider } from '~/context/inventory';
import { useTenantContext } from '~/context/tenant/useTenantContext';
import { useDisclosure } from '~/hooks/useDisclosure';
import { AdminRoutes } from '~/routes';
import { useGetInventoriesQuery } from '~/services/inventory/inventory.queries';
import { type Inventory } from '~/services/inventory/inventory.types';
import { formatDate } from '~/utils/date';
import { getStockStatus, getStockStatusConfig } from '~/pages/admin/inventory/utils';
import { formatCurrency } from '~/utils/number';
import { pathFor } from '~/utils/pathFor';

import { CreateInventoryModal } from './CreateInventoryModal';
import { EditInventoryModal } from './EditInventoryModal';
import { MoreDetailsMenu } from './MoreDetailsMenu';

export const InventoryPage = () => {
  const { tenantId } = useTenantContext();
  const disclosure = useDisclosure();
  const editDisclosure = useDisclosure();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInventory, setSelectedInventory] = useState<Inventory | null>(null);

  const handleEditInventory = (item: Inventory) => {
    setSelectedInventory(item);
    editDisclosure.onOpen();
  };

  const { data: inventories, isLoading } = useGetInventoriesQuery({
    tenantId,
    filters: { searchTerm: searchTerm || undefined },
  });

  return (
    <PageLayout>
      <PageContainer>
        <Breadcrumb
          items={[
            {
              icon: HomeOutlined,
              label: 'Home',
              to: pathFor({
                pathname: AdminRoutes.TenantHome,
                params: { tenantId },
              }),
            },
            {
              label: 'Inventory',
            },
          ]}
        />
        <PageHeader
          title="Inventory"
          description="Manage stock inventory items."
          action={
            <Button
              onClick={disclosure.onOpen}
              variant="contained"
              size="large"
              startIcon={<AddOutlined fontSize="small" />}
            >
              Add Inventory Item
            </Button>
          }
        />
        <DataTable
          id="inventory-table"
          collection={DataTable.collection({
            items: inventories || [],
            itemToValue: (item) => item.id,
            itemToString: (item) => item.productName,
          })}
          search={{
            enabled: true,
            placeholder: 'Search inventory',
            defaultValue: '',
            onValueChange: setSearchTerm,
          }}
          columns={[
            {
              id: 'name',
              heading: 'Product Name',
              cell: (item) => (
                <Stack
                  onClick={() => handleEditInventory(item)}
                  sx={{
                    cursor: 'pointer',
                    width: 'fit-content',
                    '&:hover .inventory-name': { fontWeight: 600, textDecoration: 'underline' },
                  }}
                >
                  <Typography variant="body2" color="text.primary" className="inventory-name">
                    {item.productName}
                  </Typography>
                </Stack>
              ),
              orderable: true,
              width: 200,
            },

            {
              id: 'quantity',
              heading: 'Quantity',
              cell: (item) => (
                <Typography variant="body2" color="text.secondary">
                  {item.quantity}
                </Typography>
              ),
              width: 120,
            },
            {
              id: 'price',
              heading: 'Current Price',
              cell: (item) => (
                <Typography variant="body2" color="text.secondary">
                  {item.currentPrice ? formatCurrency(item.currentPrice, undefined, 2) : '-'}
                </Typography>
              ),
              width: 160,
            },
            {
              id: 'status',
              heading: 'Status',
              cell: (item) => {
                const status = getStockStatus(item.quantity, item.lowStockThreshold);
                if (!status) {
                  return (
                    <Typography variant="body2" color="text.secondary">
                      -
                    </Typography>
                  );
                }
                const config = getStockStatusConfig(status);
                return <Chip label={config.label} color={config.color} />;
              },
              width: 140,
            },
            {
              id: 'updatedAt',
              heading: 'Last Updated',
              cell: (item) => (
                <Typography variant="body2" color="text.secondary">
                  {formatDate(item.updatedAt, 'YYYY-MM-DD hh:mm')}
                </Typography>
              ),
            },
            {
              id: 'actions',
              heading: '',
              align: 'right',
              cell: (item) => (
                <InventoryProvider inventory={item}>
                  <MoreDetailsMenu />
                </InventoryProvider>
              ),
              orderable: false,
            },
          ]}
          loading={isLoading}
          emptyMessage="No inventory items found"
        />
      </PageContainer>

      <CreateInventoryModal open={disclosure.open} onClose={disclosure.onClose} />

      {selectedInventory && (
        <InventoryProvider inventory={selectedInventory}>
          <EditInventoryModal open={editDisclosure.open} onClose={editDisclosure.onClose} />
        </InventoryProvider>
      )}
    </PageLayout>
  );
};
