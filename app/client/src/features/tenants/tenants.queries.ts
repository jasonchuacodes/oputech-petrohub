import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  CreateTenantDocument,
  TenantsDocument,
  type CreateTenantMutation,
  type TenantsQuery,
} from '~/generated/graphql'
import { graphqlClient } from '~/lib/graphql'

export type TenantAccess = TenantsQuery['tenants'][number]
export type TenantSummary = CreateTenantMutation['createTenant']

const tenantKeys = {
  all: ['tenants'] as const,
}

export function useTenantsQuery() {
  return useQuery({
    queryKey: tenantKeys.all,
    queryFn: async () => (await graphqlClient.request(TenantsDocument)).tenants,
    staleTime: 5 * 60 * 1000,
  })
}

export function useCreateTenantMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (name: string) =>
      (await graphqlClient.request(CreateTenantDocument, { input: { name } })).createTenant,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: tenantKeys.all })
    },
  })
}
