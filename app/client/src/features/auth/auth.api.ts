import { api, getCsrfToken } from '~/lib/api'
import type { LoginResponse, Session } from './auth.types'

export async function getSession(): Promise<Session> {
  return (await api.get<Session>('/api/auth/me')).data
}

export async function login(input: { username: string; password: string }): Promise<LoginResponse> {
  return (await api.post<LoginResponse>('/api/auth/login', input)).data
}

export async function logout(): Promise<void> {
  const csrfToken = await getCsrfToken()
  await api.post('/api/auth/logout', undefined, { headers: { 'x-csrf-token': csrfToken } })
}

export async function changePassword(input: {
  currentPassword: string
  newPassword: string
}): Promise<void> {
  const csrfToken = await getCsrfToken()
  await api.post('/api/auth/change-password', input, {
    headers: { 'x-csrf-token': csrfToken },
  })
}
