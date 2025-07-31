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
const createTenant = async (data: CreateTenantInput): Promise<Tenant> => {
  const res = await axios.post('/tenants/create', data);

  return res.data.data.tenant
};

export { createTenant, getTenants, getTenantUsers };
