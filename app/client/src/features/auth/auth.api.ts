import axios from 'axios'
import type { SessionResponse } from './auth.types'

const apiUrl = process.env.NEXT_PUBLIC_API_URL?.trim() || '/api'
const authHttp = axios.create({
  baseURL: apiUrl,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15_000,
  withCredentials: true,
})

type ErrorResponse = { code?: string }

export class AuthApiError extends Error {
  readonly code?: string
  readonly status: number

  constructor(status: number, code?: string) {
    super('Authentication request failed')
    this.name = 'AuthApiError'
    this.code = code
    this.status = status
  }
}

async function authRequest<T>(request: () => Promise<{ data: T }>): Promise<T> {
  try {
    return (await request()).data
  } catch (error) {
    if (!axios.isAxiosError<ErrorResponse>(error)) throw new AuthApiError(0)
    throw new AuthApiError(error.response?.status ?? 0, error.response?.data?.code)
  }
}

export function loginSession(input: { username: string; password: string }) {
  return authRequest(() => authHttp.post<SessionResponse>('auth/session', input))
}

export function refreshSession() {
  return authRequest(() => authHttp.post<SessionResponse>('auth/session/refresh', {}))
}

export function logoutSession() {
  return authRequest(() => authHttp.delete<void>('auth/session', { data: {} }))
}

export function changePasswordRequest(
  accessToken: string,
  input: { currentPassword: string; newPassword: string },
) {
  return authRequest(() =>
    authHttp.post<void>('auth/change-password', input, {
      headers: { Authorization: `Bearer ${accessToken}` },
    }),
  )
}
