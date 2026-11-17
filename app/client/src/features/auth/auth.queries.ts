import { useMutation } from '@tanstack/react-query'
import { useAuth } from './auth-context'

export function useSessionQuery() {
  const auth = useAuth()
  return {
    isPending: auth.status === 'bootstrapping',
    isError: auth.status === 'unavailable',
    isUnavailable: auth.status === 'unavailable',
    isAnonymous: auth.status === 'anonymous',
    isSuccess: auth.session !== null,
    data: auth.session ?? undefined,
    retry: auth.retrySession,
  }
}

export function useLoginMutation() {
  const auth = useAuth()
  return useMutation({
    mutationFn: auth.login,
  })
}

export function useLogoutMutation() {
  const auth = useAuth()
  return useMutation({
    mutationFn: auth.logout,
  })
}

export function useChangePasswordMutation() {
  const auth = useAuth()
  return useMutation({
    mutationFn: auth.changePassword,
  })
}
