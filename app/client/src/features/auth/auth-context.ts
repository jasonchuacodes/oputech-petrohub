import { createContext, use } from 'react'
import type { AuthSessionSnapshot } from './auth-session'
import type { SessionResponse } from './auth.types'

export type AuthContextValue = AuthSessionSnapshot & {
  login: (input: { username: string; password: string }) => Promise<SessionResponse>
  logout: () => Promise<void>
  activateTenant: (tenantId: string) => void
  changePassword: (input: { currentPassword: string; newPassword: string }) => Promise<void>
  updateProfile: (input: { firstName?: string; lastName?: string; fullName: string }) => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth(): AuthContextValue {
  const context = use(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}
