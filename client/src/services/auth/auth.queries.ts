import { useMutation, useQuery } from '@tanstack/react-query';

import { loginUser, logoutUser, getMe, registerUser } from './auth.api';

const useRegisterUserMutation = () =>
  useMutation({
    mutationFn: registerUser,
  });

const useLoginMutation = () =>
  useMutation({
    mutationFn: loginUser,
  });

const useLogoutMutation = () =>
  useMutation({
    mutationFn: logoutUser,
  });

const useGetMe = () =>
  useQuery({
    queryFn: getMe,
    queryKey: ['auth'],
  });

export { useRegisterUserMutation, useLoginMutation, useLogoutMutation, useGetMe };
