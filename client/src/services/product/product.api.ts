import axios from '~/lib/axiosInstance';
import type { Product, CreateProductPayload, UpdateProductPayload } from './product.types';

const getProductsByTenantId = async (
  tenantId: string,
  category?: string
): Promise<Product[]> => {
  const res = await axios.get('/products', {
    params: { tenantId, ...(category && { category }) }
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

export { getProductsByTenantId, getProductById, createProduct, updateProduct };
