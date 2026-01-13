import { Box, Stack, Typography } from '@mui/material';
import { HomeOutlined, AddOutlined } from '@mui/icons-material';

import { PageHeader } from '~/components/layouts';
import {
  Breadcrumb,
  Button,
  CardContainer,
  LoadingSpinner,
  NoData,
  PageContainer,
  PageLayout,
} from '~/components/ui';
import { ProductProvider } from '~/context/product';
import { useTenantContext } from '~/context/tenant/useTenantContext';
import { useDisclosure } from '~/hooks/useDisclosure';
import { AdminRoutes } from '~/routes';
import { useGetProductsQuery } from '~/services/product/product.queries';
import { formatCurrency } from '~/utils/number';
import { pathFor } from '~/utils/pathFor';

import { CreateProductModal } from './CreateProductModal';
import { MoreDetailsMenu } from './MoreDetailsMenu';

export const ProductsPage = () => {
  const { tenantId } = useTenantContext();
  const disclosure = useDisclosure();
  const { data: products, isLoading } = useGetProductsQuery(tenantId);

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
              label: 'Products',
            },
          ]}
        />
        <PageHeader
          title="Products"
          description="Manage your fuel products here."
          action={
            <Button
              onClick={disclosure.onOpen}
              variant="contained"
              size="large"
              startIcon={<AddOutlined fontSize="small" />}
            >
              Add Product
            </Button>
          }
        />

        {isLoading ? (
          <Box display="flex" justifyContent="center" alignItems="center" pt={10}>
            <LoadingSpinner />
          </Box>
        ) : products && products.length > 0 ? (
          <Stack spacing={2}>
            {products.map((product) => (
              <ProductProvider key={product.id} product={product}>
                <CardContainer maxWidth={560}>
                  <Stack direction="row" justifyContent="space-between" alignItems="start">
                    <Stack spacing={1}>
                      <Typography variant="h6">{product.name}</Typography>
                    </Stack>

                    <MoreDetailsMenu />
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      Price
                    </Typography>
                    <Typography variant="body2" color="text.primary">
                      {formatCurrency(Number(product?.productPrice?.price))}
                    </Typography>
                  </Stack>
                </CardContainer>
              </ProductProvider>
            ))}
          </Stack>
        ) : (
          <Box pt={10}>
            <NoData text="No product found." />
          </Box>
        )}
      </PageContainer>

      <CreateProductModal open={disclosure.open} onClose={disclosure.onClose} />
    </PageLayout>
  );
};
