export type { UserRole } from '~/generated/graphql'
import type { UserRole } from '~/generated/graphql'

export type AuthUser = {
  id: string
  displayName: string
  username: string
  status: string
  role: UserRole
  accountHolderId?: string
  tenantIds: string[]
  currentTenantId?: string
  tenantSelectionVersion: number
  shouldChangePassword: boolean
}

export type TenantAccess = {
  tenantId: string
  role: UserRole
}

export type Session = {
  user: AuthUser
  tenantAccess: TenantAccess[]
}

export type SessionResponse = Session & {
  accessToken: string
  tokenType: 'access'
  dateTimeExpiration: string
}
