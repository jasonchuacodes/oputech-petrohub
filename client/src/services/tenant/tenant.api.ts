import axios from '~/lib/axiosInstance';

import type { CreateTenantInput } from '~/schema/createTenantSchema';

import type { User } from '../user/user.types';
import type { Tenant } from './tenant.types';

// Queries
const getTenants = async (): Promise<Tenant[]> => {
  const res = await axios.get('/tenants');

  return res.data.data.tenants;
};

const getTenantUsers = async (tenantId: string): Promise<User[]> => {
  const res = await axios.get(`/tenants/${tenantId}/users`);

  return res.data.data.users;
};

// Mutations
const createTenant = (data: CreateTenantInput) => {
  return axios.post('/tenants/create', data);
};

export { createTenant, getTenants, getTenantUsers };
