import { useQuery } from '@tanstack/react-query'
import { graphqlQuery } from '~/lib/graphql'
import type { MembershipRole } from '../auth/auth.types'

export type ViewerTenant = {
  membershipId: string
  role: MembershipRole
  tenant: { id: string; name: string; timezone: string; currency: string }
}

const myTenantsDocument = `
  query MyTenants {
    myTenants {
      membershipId
      role
      tenant { id name timezone currency }
    }
  }
`

export function useMyTenantsQuery() {
  return useQuery({
    queryKey: ['tenants', 'mine'],
    queryFn: async () =>
      (
        await graphqlQuery<{ myTenants: ViewerTenant[] }>(myTenantsDocument)
      ).myTenants,
    staleTime: 5 * 60 * 1000,
  })
}
