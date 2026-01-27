import axios from '~/lib/axiosInstance';

import type { CreateTenantInput } from '~/schema/createTenantSchema';
import type { UpdateTenantPayload } from '~/schema/updateTenantSchema';

import type { Tenant, GetTenantUsersFilters } from './tenant.types';
import type { User } from '../user/user.types';

// Queries
const getTenant = async (tenantId: string): Promise<Tenant> => {
  const res = await axios.get(`/tenants/${tenantId}`);
  
  return res.data.data.tenant;
};

const getTenants = async (): Promise<Tenant[]> => {
  const res = await axios.get('/tenants');

  return res.data.data.tenants;
};

const getTenantUsers = async (
  tenantId: string,
  filters?: GetTenantUsersFilters,
  signal?: AbortSignal,
): Promise<User[]> => {
  const res = await axios.get(`/tenants/${tenantId}/users`, {
    params: { ...filters },
    signal,
  });

  return res.data.data.users;
};

// Mutations
const createTenant = async (data: CreateTenantInput): Promise<Tenant> => {
  const res = await axios.post('/tenants/create', data);

  return res.data.data.tenant;
};

const updateTenant = async (data: UpdateTenantPayload): Promise<Tenant> => {
  const res = await axios.put('/tenants/update', data);

  return res.data.data.tenant;
};

export { createTenant, updateTenant, getTenant, getTenants, getTenantUsers };
