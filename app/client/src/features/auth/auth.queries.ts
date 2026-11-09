import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { setCsrfToken } from '~/lib/api'
import { changePassword, getSession, login, logout } from './auth.api'
import type { Session } from './auth.types'

export const sessionQueryKey = ['auth', 'session'] as const

export function useSessionQuery() {
  return useQuery({
    queryKey: sessionQueryKey,
    queryFn: getSession,
    retry: (failureCount, error) => !isAxiosError(error) && failureCount < 1,
    staleTime: 5 * 60 * 1000,
  })
}

export function useLoginMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: login,
    onSuccess: ({ csrfToken, ...session }) => {
      setCsrfToken(csrfToken)
      queryClient.setQueryData<Session>(sessionQueryKey, session)
    },
  })
}

export function useLogoutMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: logout,
    onSettled: async () => {
      setCsrfToken(null)
      queryClient.clear()
    },
  })
}

export function useChangePasswordMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      setCsrfToken(null)
      queryClient.clear()
    },
  })
}
