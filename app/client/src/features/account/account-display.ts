import type { AuthUser, UserRole } from '../auth/auth.types'

export function getUserInitials(user?: AuthUser): string {
  const name = user?.fullName?.trim() || user?.username || ''
  const parts = name.split(/\s+/).filter(Boolean)

  if (parts.length > 1) return `${parts[0][0]}${parts.at(-1)?.[0] ?? ''}`.toUpperCase()

  const source = parts[0] || user?.username || 'A'
  return source.slice(0, 2).toUpperCase()
}

export function getUserRoleLabel(role?: UserRole): string {
  if (role === 'superadmin') return 'Super administrator'
  if (role === 'admin') return 'Administrator'
  if (role === 'member') return 'Member'
  return 'Account'
}
