import { useState } from 'react';
import { Grid, Stack, Typography } from '@mui/material';

import { Show } from '~/components/ui';
import { useTenantContext } from '~/context/tenant/useTenantContext';
import { useGetProductsByTypeQuery } from '~/services/product/product.queries';
import type { Product } from '~/services/product/product.types';

import { ProductPrice } from './ProductPrice';
import { EditProductTypePriceModal } from './EditProductTypePriceModal';

export const ProductPricesSection = () => {
  const { tenantId } = useTenantContext();

  const { data: productsData, isLoading: isLoadingProducts } = useGetProductsByTypeQuery(tenantId);
  const products = productsData ?? [];

  const [editProduct, setEditProduct] = useState<Product | null>(null);

  return (
    <Show when={!isLoadingProducts && products.length > 0}>
      <Stack spacing={2}>
        <Stack spacing={0.5}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Fuel Prices
          </Typography>
          <Typography variant="body2" color="text.secondary">
            View current fuel product prices
          </Typography>
        </Stack>
        <Grid container spacing={2} alignItems="stretch">
          {products &&
            products.map((product) => (
              <Grid key={product.id} size={{ xs: 12, md: 6, lg: 4 }} display="flex">
                <ProductPrice product={product} onEdit={setEditProduct} />
              </Grid>
            ))}
        </Grid>
      </Stack>

      {editProduct && (
        <EditProductTypePriceModal
          open={!!editProduct}
          onClose={() => setEditProduct(null)}
          product={editProduct}
        />
      )}
    </Show>
  );
};
