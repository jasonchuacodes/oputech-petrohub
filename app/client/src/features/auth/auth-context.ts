import { createContext, use } from 'react'
import type { AuthSessionSnapshot } from './auth-session'
import type { SessionResponse } from './auth.types'

export type AuthContextValue = AuthSessionSnapshot & {
  login: (input: { username: string; password: string }) => Promise<SessionResponse>
  logout: () => Promise<void>
  changePassword: (input: { currentPassword: string; newPassword: string }) => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth(): AuthContextValue {
  const context = use(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}
