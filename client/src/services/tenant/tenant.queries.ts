import { useMutation, useQuery, useQueryClient, type UseQueryResult } from '@tanstack/react-query';

import { createTenant, getTenants, getTenantUsers } from './tenant.api';
import type { Tenant } from './tenant.types';

// Queries
const useGetTenantsQuery = (): UseQueryResult<Tenant[]> => {
  return useQuery({
    queryKey: ['tenants'],
    queryFn: getTenants,
  });
};

const useGetTenantUsersQuery = ({ tenantId }: { tenantId?: string }) => {
  return useQuery({
    queryKey: ['tenantUsers', tenantId],
    queryFn: () => getTenantUsers(tenantId!),
    enabled: !!tenantId
  });
};

// Mutations
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

export { useCreateTenantMutation, useGetTenantsQuery, useGetTenantUsersQuery };
