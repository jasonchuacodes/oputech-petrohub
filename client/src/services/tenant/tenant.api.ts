import axios from '~/lib/axiosInstance';

import type { CreateTenantInput } from '~/schema/createTenantSchema';

// Queries

// Mutations
const createTenant = (data: CreateTenantInput) => {
  return axios.post('/tenants/create', data);
};

export { createTenant };
