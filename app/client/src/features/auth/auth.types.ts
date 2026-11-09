export type MembershipRole = 'ADMIN' | 'EMPLOYEE'

export type AuthUser = {
  id: string
  displayName: string
  username: string
  status: string
  shouldChangePassword: boolean
}

export type AuthMembership = {
  id: string
  tenantId: string
  role: MembershipRole
}

export type Session = {
  user: AuthUser
  memberships: AuthMembership[]
}

export type LoginResponse = Session & { csrfToken: string }
