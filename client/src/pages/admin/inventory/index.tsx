import { Typography } from '@mui/material';
import { HomeOutlined, AddOutlined } from '@mui/icons-material';

import { PageHeader } from '~/components/layouts';
import { Breadcrumb, Button, DataTable, PageContainer, PageLayout } from '~/components/ui';
import { StockInventoryProvider } from '~/context/stock-inventory';
import { useTenantContext } from '~/context/tenant/useTenantContext';
import { useDisclosure } from '~/hooks/useDisclosure';
import { AdminRoutes } from '~/routes';
import { useGetStockInventoriesQuery } from '~/services/inventory/inventory.queries';
import { formatDate } from '~/utils/date';
import { formatCurrency } from '~/utils/number';
import { pathFor } from '~/utils/pathFor';

import { CreateStockInventoryModal } from './CreateStockInventoryModal';
import { MoreDetailsMenu } from './MoreDetailsMenu';

export const InventoryPage = () => {
  const { tenantId } = useTenantContext();
  const disclosure = useDisclosure();
  const { data: stockInventories, isLoading } = useGetStockInventoriesQuery(tenantId);

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
          id="stock-inventory-table"
          collection={DataTable.collection({
            items: stockInventories || [],
            itemToValue: (item) => item.id,
            itemToString: (item) => item.productName,
          })}
          columns={[
            {
              id: 'name',
              heading: 'Product Name',
              cell: (item) => (
                <Typography variant="body2" color="text.primary">
                  {item.productName}
                </Typography>
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
                <StockInventoryProvider stockInventory={item}>
                  <MoreDetailsMenu />
                </StockInventoryProvider>
              ),
              orderable: false,
            },
          ]}
          loading={isLoading}
          emptyMessage="No inventory items found"
        />
      </PageContainer>

      <CreateStockInventoryModal open={disclosure.open} onClose={disclosure.onClose} />
    </PageLayout>
  );
};
