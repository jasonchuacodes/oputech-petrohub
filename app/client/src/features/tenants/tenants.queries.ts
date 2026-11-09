import { useQuery } from '@tanstack/react-query'
import {
  TenantsDocument,
  type TenantsQuery,
} from '~/generated/graphql'
import { graphqlClient } from '~/lib/graphql'

export type ViewerTenant = TenantsQuery['tenants'][number]

export function useTenantsQuery() {
  return useQuery({
    queryKey: ['tenants'],
    queryFn: async () => (await graphqlClient.request(TenantsDocument)).tenants,
    staleTime: 5 * 60 * 1000,
  })
}
