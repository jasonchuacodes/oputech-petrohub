import axios from '~/lib/axiosInstance';

import type { CreateTenantInput } from '~/schema/createTenantSchema';

// Queries
const getTenants = async () => {
  const res = await axios.get('/tenants');

  return res.data.data.tenants;
};

// Mutations
const createTenant = (data: CreateTenantInput) => {
  return axios.post('/tenants/create', data);
};

export { createTenant, getTenants };
