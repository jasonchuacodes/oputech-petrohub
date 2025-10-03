import { useMutation, useQuery, useQueryClient, type UseQueryResult } from '@tanstack/react-query';

import { createTenant, getTenant, getTenants, getTenantUsers, updateTenant } from './tenant.api';
import type { Tenant } from './tenant.types';

// Queries
const useGetTenantsQuery = (): UseQueryResult<Tenant[]> => {
  return useQuery({
    queryKey: ['tenants'],
    queryFn: getTenants,
    retry: false,
  });
};

const useGetTenantByIdQuery = ({ tenantId }: { tenantId?: string }) => {
  return useQuery({
    queryKey: ['tenant', tenantId],
    queryFn: () => getTenant(tenantId!),
    enabled: !!tenantId,
    retry: false,
  });
};

const useGetTenantUsersQuery = ({ tenantId }: { tenantId?: string }) => {
  return useQuery({
    queryKey: ['tenantUsers', tenantId],
    queryFn: () => getTenantUsers(tenantId!),
    enabled: !!tenantId,
  });
};

// Mutations
const useCreateTenantMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTenant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
    },
  });
};

const useUpdateTenantMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTenant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
    },
  });
};

export {
  useCreateTenantMutation,
  useUpdateTenantMutation,
  useGetTenantByIdQuery,
  useGetTenantsQuery,
  useGetTenantUsersQuery,
};
