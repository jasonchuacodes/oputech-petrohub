import { Stack, Typography } from '@mui/material';
import { HomeOutlined, AddOutlined, CircleOutlined } from '@mui/icons-material';

import { PageHeader } from '~/components/layouts';
import { Breadcrumb, Button, DataTable, PageContainer, PageLayout } from '~/components/ui';
import { ProductProvider } from '~/context/product';
import { useTenantContext } from '~/context/tenant/useTenantContext';
import { useDisclosure } from '~/hooks/useDisclosure';
import { AdminRoutes } from '~/routes';
import { useGetProductsQuery } from '~/services/product/product.queries';
import { ProductCategory } from '~/services/product/product.types';
import { formatDate } from '~/utils/date';
import { formatCurrency } from '~/utils/number';
import { pathFor } from '~/utils/pathFor';

import { CreateProductModal } from './CreateProductModal';
import { MoreDetailsMenu } from './MoreDetailsMenu';

export const ProductsPage = () => {
  const { tenantId } = useTenantContext();
  const disclosure = useDisclosure();
  const { data: products, isLoading } = useGetProductsQuery(tenantId, ProductCategory.FUEL);

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
              label: 'Fuel',
            },
          ]}
        />
        <PageHeader
          title="Fuel Products"
          description="Manage your fuel products here."
          action={
            <Button
              onClick={disclosure.onOpen}
              variant="contained"
              size="large"
              startIcon={<AddOutlined fontSize="small" />}
            >
              Add Fuel Product
            </Button>
          }
        />
        <DataTable
          id="fuel-products-table"
          collection={DataTable.collection({
            items: products || [],
            itemToValue: (product) => product.id,
            itemToString: (product) => product.name,
          })}
          columns={[
            {
              id: 'name',
              heading: 'Product Name',
              cell: (product) => (
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <CircleOutlined
                    fontSize="small"
                    color={product.color === 'grey' ? undefined : product.color}
                    sx={product.color === 'grey' ? { color: '#9E9E9E' } : undefined}
                  />
                  <Typography variant="body2" color="text.primary">
                    {product.name}
                  </Typography>
                </Stack>
              ),
              orderable: true,
              width: 240,
            },
            {
              id: 'reading',
              heading: 'Current Reading',
              cell: (product) => (
                <Typography variant="body2" color="text.secondary">
                  {product.productReading.reading}
                </Typography>
              ),
              width: 160,
            },
            {
              id: 'price',
              heading: 'Current Price',
              cell: (product) => (
                <Typography variant="body2" color="text.secondary">
                  {formatCurrency(product.productPrice.price, undefined, 2)}
                </Typography>
              ),
              width: 160,
            },
            {
              id: 'priceChange',
              heading: 'Price Change',
              cell: (product) => (
                <Typography variant="body2" color="text.secondary">
                  {product.scheduledPrice
                    ? formatCurrency(product.scheduledPrice.price, undefined, 2)
                    : '-'}
                </Typography>
              ),
              width: 160,
            },
            {
              id: 'effectiveFrom',
              heading: 'Effective From',
              cell: (product) => {
                const effectiveFrom = product.scheduledPrice?.effectiveFrom;

                const shouldDisplay = effectiveFrom && new Date(effectiveFrom) > new Date();

                return (
                  <Typography variant="body2" color="text.secondary">
                    {shouldDisplay ? formatDate(effectiveFrom, 'YYYY-MM-DD hh:mm') : '-'}
                  </Typography>
                );
              },
              width: 160,
            },
            {
              id: 'updatedAt',
              heading: 'Last Updated',
              cell: (product) => (
                <Typography variant="body2" color="text.secondary">
                  {formatDate(product.productPrice.effectiveFrom, 'YYYY-MM-DD hh:mm')}
                </Typography>
              ),
            },
            {
              id: 'actions',
              heading: '',
              align: 'right',
              cell: (product) => (
                <ProductProvider product={product}>
                  <MoreDetailsMenu />
                </ProductProvider>
              ),
              orderable: false,
            },
          ]}
          loading={isLoading}
          emptyMessage="No products found"
        />
      </PageContainer>

      <CreateProductModal open={disclosure.open} onClose={disclosure.onClose} />
    </PageLayout>
  );
};
