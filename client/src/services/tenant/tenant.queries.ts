import { useMutation, useQuery, useQueryClient, type UseQueryResult } from '@tanstack/react-query';

import { createTenant, getTenants } from './tenant.api';
import type { Tenant } from './tenant.types';

const useCreateTenantMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTenant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
      queryClient.invalidateQueries({ queryKey: ['auth'] });
    },
  });
};

const useGetTenantsQuery = (): UseQueryResult<Tenant[]> => {
  return useQuery({
    queryKey: ['tenants'],
    queryFn: getTenants,
  });
};

export { useCreateTenantMutation, useGetTenantsQuery };
