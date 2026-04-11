import axios from '~/lib/axiosInstance';
import type { Product, CreateProductPayload, UpdateProductPayload, GetProductsFilters, ProductType } from './product.types';

const getProductsByTenantId = async (
  tenantId: string,
  filters?: GetProductsFilters
): Promise<Product[]> => {
  const res = await axios.get('/products', {
    params: { tenantId, ...filters }
  });
  return res.data.data;
};

const getProductById = async (productId: string, tenantId: string): Promise<Product> => {
  const res = await axios.get(`/products/${productId}`, { params: { tenantId } });
  return res.data.data;
};

const createProduct = (data: CreateProductPayload) => {
  return axios.post('/products', data);
};

const updateProduct = (productId: string, data: UpdateProductPayload, tenantId: string) => {
  return axios.put(`/products/${productId}`, data, { params: { tenantId } });
};

export const getProductsByType = async (tenantId: string): Promise<Product[]> => {
  const { data } = await axios.get<{ data: Product[] }>('/products/types', {
    params: { tenantId },
  });
  return data.data;
};

export const deactivateProduct = async (productId: string, tenantId: string): Promise<void> => {
  await axios.patch(`/products/${productId}/deactivate`, null, {
    params: { tenantId },
  });
};

export const cancelScheduledPrice = async (productId: string, tenantId: string): Promise<Product> => {
  const res = await axios.delete<{ data: Product }>(`/products/${productId}/scheduled-price`, {
    params: { tenantId },
  });
  return res.data.data;
};

export const updateProductTypePrice = async (
  tenantId: string,
  productType: ProductType,
  data: { productPrice: number; effectiveFrom?: string },
): Promise<Product> => {
  const res = await axios.put<{ data: Product }>(
    `/products/types/${productType}/price`,
    data,
    { params: { tenantId } },
  );
  return res.data.data;
};

export { getProductsByTenantId, getProductById, createProduct, updateProduct };
