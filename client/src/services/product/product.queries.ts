import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getProductsByTenantId,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from './product.api';
import type { CreateProductPayload, ProductCategory, UpdateProductPayload } from './product.types';

const useGetProductsQuery = (tenantId?: string, category?: ProductCategory) => {
  return useQuery({
    queryKey: ['products', tenantId, category],
    queryFn: () => getProductsByTenantId(tenantId!, category),
    enabled: !!tenantId,
  });
};

const useGetProductQuery = ({
  productId,
  tenantId,
}: {
  productId?: string;
  tenantId?: string;
}) => {
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

const useDeleteProductMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, tenantId }: { productId: string; tenantId: string }) =>
      deleteProduct(productId, tenantId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['products', variables.tenantId] });
    },
  });
};

export {
  useGetProductsQuery,
  useGetProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
};
