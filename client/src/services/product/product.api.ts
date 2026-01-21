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

const deleteProduct = (productId: string, tenantId: string) => {
  return axios.delete(`/products/${productId}`, { params: { tenantId } });
};

export { getProductsByTenantId, getProductById, createProduct, updateProduct, deleteProduct };
