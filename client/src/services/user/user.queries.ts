import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { createUser, deleteUser, getUserById, updateUser, resetPassword } from './user.api';

import type { UpdateUserPayload } from '~/schema/updateUserSchema';

// Queries
const useGetUserQuery = ({ tenantId, userId }: { tenantId?: string; userId?: string }) => {
  return useQuery({
    queryKey: ['tenantUser', tenantId, userId],
    queryFn: () => getUserById(userId, tenantId),
  });
};

// Mutations
const useCreateUserMutation = ({ tenantId }: { tenantId?: string }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenantUsers', tenantId] });
    },
  });
};

const useUpdateUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      data,
      tenantId,
    }: {
      userId: string;
      tenantId: string;
      data: UpdateUserPayload;
    }) => updateUser(userId, data, tenantId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tenantUsers', variables.tenantId] });
      queryClient.invalidateQueries({ queryKey: ['tenantUser', variables.tenantId, variables.userId] });
    },
  });
};

const useDeleteUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId }: { userId: string; tenantId: string }) => deleteUser(userId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tenantUsers', variables.tenantId] });
    },
  });
};

const useResetPasswordMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, password, tenantId }: { userId: string; password: string; tenantId: string }) =>
      resetPassword(userId, password, tenantId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tenantUsers', variables.tenantId] });
    },
  });
};

export {
  useGetUserQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useResetPasswordMutation,
};
