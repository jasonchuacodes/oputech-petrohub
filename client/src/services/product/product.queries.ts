import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getProductsByTenantId,
  getProductById,
  createProduct,
  updateProduct,
  getProductsByType,
  deactivateProduct,
} from './product.api';
import type { CreateProductPayload, GetProductsFilters, UpdateProductPayload } from './product.types';

const useGetProductsQuery = (tenantId?: string, filters?: GetProductsFilters) => {
  return useQuery({
    queryKey: ['products', tenantId, filters],
    queryFn: () => getProductsByTenantId(tenantId!, filters),
    enabled: !!tenantId,
  });
};

const useGetProductQuery = ({ productId, tenantId }: { productId?: string; tenantId?: string }) => {
  return useQuery({
    queryKey: ['product', productId, tenantId],
    queryFn: () => getProductById(productId!, tenantId!),
    enabled: !!productId && !!tenantId,
  });
};

const useCreateProductMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProductPayload) => createProduct(data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['products', variables.tenantId] });
    },
  });
};

const useUpdateProductMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      productId,
      data,
      tenantId,
    }: {
      productId: string;
      data: UpdateProductPayload;
      tenantId: string;
    }) => updateProduct(productId, data, tenantId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['products', variables.tenantId] });
    },
  });
};

const useGetProductsByTypeQuery = (tenantId?: string) => {
  return useQuery({
    queryKey: ['products', 'by-type', tenantId],
    queryFn: () => getProductsByType(tenantId!),
    enabled: !!tenantId,
  });
};

const useDeactivateProductMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, tenantId }: { productId: string; tenantId: string }) =>
      deactivateProduct(productId, tenantId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

export {
  useGetProductsQuery,
  useGetProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useGetProductsByTypeQuery,
  useDeactivateProductMutation,
};
