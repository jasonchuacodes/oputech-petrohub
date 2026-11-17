import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  CreateUserDocument,
  DeactivateUserDocument,
  ResetUserPasswordDocument,
  UserDetailsDocument,
  UpdateUserDocument,
  UsersDocument,
  type CreateUserInput,
  type DeactivateUserInput,
  type ResetUserPasswordInput,
  type UpdateUserInput,
  type UserDetailsQuery,
  type UsersQuery,
  type TenantUserAvailability,
} from '~/generated/graphql'
import { graphqlClient } from '~/lib/graphql'

export type UserSummary = UsersQuery['users']['items'][number]
export type UserDetails = UserDetailsQuery['userDetails']

const userKeys = {
  tenant: (tenantId: string) => ['users', tenantId] as const,
  detail: (tenantId: string, userId: string) =>
    [...userKeys.tenant(tenantId), 'detail', userId] as const,
  list: (tenantId: string, availability: TenantUserAvailability, offset: number, limit: number) =>
    [...userKeys.tenant(tenantId), { availability, offset, limit }] as const,
}

export function useUserDetailsQuery(tenantId: string, userId: string) {
  return useQuery({
    queryKey: userKeys.detail(tenantId, userId),
    queryFn: async () =>
      (
        await graphqlClient.request(
          UserDetailsDocument,
          { input: { userId } },
          { tenantId },
        )
      ).userDetails,
    gcTime: 0,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })
}

export function useUsersQuery(
  tenantId: string,
  availability: TenantUserAvailability,
  offset: number,
  limit: number,
) {
  return useQuery({
    queryKey: userKeys.list(tenantId, availability, offset, limit),
    queryFn: async () =>
      (
        await graphqlClient.request(
          UsersDocument,
          { input: { availability, offset, limit } },
          { tenantId },
        )
      ).users,
    enabled: Boolean(tenantId),
    refetchOnWindowFocus: true,
    refetchInterval: 60_000,
  })
}

export function useCreateUserMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ tenantId, input }: { tenantId: string; input: CreateUserInput }) =>
      (await graphqlClient.request(CreateUserDocument, { input }, { tenantId })).createUser,
    onSuccess: async (_user, { tenantId }) => {
      await queryClient.invalidateQueries({ queryKey: userKeys.tenant(tenantId) })
    },
  })
}

export function useUpdateUserMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ tenantId, input }: { tenantId: string; input: UpdateUserInput }) =>
      (await graphqlClient.request(UpdateUserDocument, { input }, { tenantId })).updateUser,
    onSuccess: async (_user, { tenantId }) => {
      await queryClient.invalidateQueries({ queryKey: userKeys.tenant(tenantId) })
    },
  })
}

export function useDeactivateUserMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ tenantId, input }: { tenantId: string; input: DeactivateUserInput }) =>
      (await graphqlClient.request(DeactivateUserDocument, { input }, { tenantId })).deactivateUser,
    onSuccess: async (_user, { tenantId }) => {
      await queryClient.invalidateQueries({ queryKey: userKeys.tenant(tenantId) })
    },
  })
}

export function useResetUserPasswordMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      tenantId,
      input,
    }: {
      tenantId: string
      input: ResetUserPasswordInput
    }) =>
      (await graphqlClient.request(ResetUserPasswordDocument, { input }, { tenantId }))
        .resetUserPassword,
    onSuccess: async (_user, { tenantId }) => {
      await queryClient.invalidateQueries({ queryKey: userKeys.tenant(tenantId) })
    },
  })
}
