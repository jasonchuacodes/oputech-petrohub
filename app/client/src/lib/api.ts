import axios from 'axios'

export const api = axios.create({
  baseURL: '',
  withCredentials: true,
  headers: { Accept: 'application/json' },
})

let csrfToken: string | null = null

export function setCsrfToken(token: string | null): void {
  csrfToken = token
}

export async function getCsrfToken(): Promise<string> {
  if (csrfToken) return csrfToken
  const response = await api.get<{ csrfToken: string }>('/api/auth/csrf')
  csrfToken = response.data.csrfToken
  return csrfToken
}
