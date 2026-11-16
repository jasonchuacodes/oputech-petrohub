import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  CreateUserDocument,
  DeactivateUserDocument,
  ResetUserPasswordDocument,
  UpdateUserDocument,
  UsersDocument,
  type CreateUserInput,
  type DeactivateUserInput,
  type ResetUserPasswordInput,
  type UpdateUserInput,
  type UsersQuery,
  type TenantUserAvailability,
} from '~/generated/graphql'
import { graphqlClient } from '~/lib/graphql'

export type UserSummary = UsersQuery['users']['items'][number]

const userKeys = {
  tenant: (tenantId: string) => ['users', tenantId] as const,
  list: (tenantId: string, availability: TenantUserAvailability, offset: number, limit: number) =>
    [...userKeys.tenant(tenantId), { availability, offset, limit }] as const,
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
