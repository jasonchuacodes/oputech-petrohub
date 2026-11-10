import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  CreateUserDocument,
  DeleteUserDocument,
  ResetUserPasswordDocument,
  UpdateUserDocument,
  UsersDocument,
  type CreateUserInput,
  type ResetUserPasswordInput,
  type UpdateUserInput,
  type UsersQuery,
} from '~/generated/graphql'
import { graphqlClient } from '~/lib/graphql'

export type UserSummary = UsersQuery['users']['items'][number]

const userKeys = {
  tenant: (tenantId: string) => ['users', tenantId] as const,
  list: (tenantId: string, offset: number, limit: number) =>
    [...userKeys.tenant(tenantId), { offset, limit }] as const,
}

export function useUsersQuery(tenantId: string, offset: number, limit: number) {
  return useQuery({
    queryKey: userKeys.list(tenantId, offset, limit),
    queryFn: async () =>
      (
        await graphqlClient.request(
          UsersDocument,
          { input: { offset, limit } },
          { tenantId },
        )
      ).users,
    enabled: Boolean(tenantId),
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

export function useDeleteUserMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ tenantId, userId }: { tenantId: string; userId: string }) =>
      (await graphqlClient.request(DeleteUserDocument, { input: { userId } }, { tenantId }))
        .deleteUser,
    onSuccess: async (_deleted, { tenantId }) => {
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
