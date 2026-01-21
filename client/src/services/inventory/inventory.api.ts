import axios from '~/lib/axiosInstance';
import type { Inventory, CreateInventoryPayload, UpdateInventoryPayload } from './inventory.types';

const getInventoriesByTenantId = async (tenantId: string): Promise<Inventory[]> => {
  const res = await axios.get('/inventory', { params: { tenantId } });
  return res.data.data;
};

const getInventoryById = async (inventoryId: string, tenantId: string): Promise<Inventory> => {
  const res = await axios.get(`/inventory/${inventoryId}`, { params: { tenantId } });
  return res.data.data;
};

const createInventory = (data: CreateInventoryPayload) => {
  return axios.post('/inventory', data);
};

const updateInventory = (inventoryId: string, data: UpdateInventoryPayload, tenantId: string) => {
  return axios.put(`/inventory/${inventoryId}`, data, { params: { tenantId } });
};

const deleteInventory = (inventoryId: string, tenantId: string) => {
  return axios.delete(`/inventory/${inventoryId}`, { params: { tenantId } });
};

export {
  getInventoriesByTenantId,
  getInventoryById,
  createInventory,
  updateInventory,
  deleteInventory,
};
