import { useMutation, useQuery } from '@tanstack/react-query';

import {
  forgotPassword,
  forceUpdatePassword,
  getMe,
  loginUser,
  logoutUser,
  registerUser,
  updatePassword,
  updateLastTenant,
} from './auth.api';
import type { User } from '../user/user.types';

// Queries
const useGetMe = () => {
  return useQuery<User | null>({
    queryFn: getMe,
    queryKey: ['auth'],
    retry: false,
    staleTime: 0,
    gcTime: 0,
  });
};

// Mutations
const useRegisterUserMutation = () =>
  useMutation({
    mutationFn: registerUser,
  });

const useUpdatePasswordMutation = () =>
  useMutation({
    mutationFn: updatePassword,
  });

const useForceUpdatePasswordMutation = () =>
  useMutation({
    mutationFn: forceUpdatePassword,
  });

const useLoginMutation = () =>
  useMutation({
    mutationFn: loginUser,
  });

const useLogoutMutation = () =>
  useMutation({
    mutationFn: logoutUser,
  });

const useForgotPasswordMutation = () =>
  useMutation({
    mutationFn: forgotPassword,
  });

const useUpdateLastTenantMutation = () =>
  useMutation({
    mutationFn: (tenantId: string) => updateLastTenant(tenantId),
  });

export {
  useForgotPasswordMutation,
  useForceUpdatePasswordMutation,
  useGetMe,
  useLoginMutation,
  useLogoutMutation,
  useRegisterUserMutation,
  useUpdatePasswordMutation,
  useUpdateLastTenantMutation,
};
