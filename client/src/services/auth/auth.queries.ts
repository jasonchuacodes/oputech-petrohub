import { useMutation, useQuery } from '@tanstack/react-query';

import { loginUser, logoutUser, getMe, registerUser, updatePassword } from './auth.api';
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

const useLoginMutation = () =>
  useMutation({
    mutationFn: loginUser,
  });

const useLogoutMutation = () =>
  useMutation({
    mutationFn: logoutUser,
  });

export {
  useRegisterUserMutation,
  useUpdatePasswordMutation,
  useLoginMutation,
  useLogoutMutation,
  useGetMe,
};
