import axios from '~/lib/axiosInstance';
import type { StockInventory, CreateStockInventoryPayload, UpdateStockInventoryPayload } from './inventory.types';

const getStockInventoriesByTenantId = async (tenantId: string): Promise<StockInventory[]> => {
  const res = await axios.get('/inventory', { params: { tenantId } });
  return res.data.data;
};

const getStockInventoryById = async (inventoryId: string, tenantId: string): Promise<StockInventory> => {
  const res = await axios.get(`/inventory/${inventoryId}`, { params: { tenantId } });
  return res.data.data;
};

const createStockInventory = (data: CreateStockInventoryPayload) => {
  return axios.post('/inventory', data);
};

const updateStockInventory = (inventoryId: string, data: UpdateStockInventoryPayload, tenantId: string) => {
  return axios.put(`/inventory/${inventoryId}`, data, { params: { tenantId } });
};

const deleteStockInventory = (inventoryId: string, tenantId: string) => {
  return axios.delete(`/inventory/${inventoryId}`, { params: { tenantId } });
};

export {
  getStockInventoriesByTenantId,
  getStockInventoryById,
  createStockInventory,
  updateStockInventory,
  deleteStockInventory,
};
