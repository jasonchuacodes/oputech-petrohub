import { Types } from 'mongoose'
import { MembershipRole } from '../memberships/schemas/membership.schema'
import { SafeUser } from '../users/users.service'

export type AuthenticatedActor = {
  userId: Types.ObjectId
  sessionId: Types.ObjectId
  csrfTokenHash: string
  user: SafeUser
}

export type AuthorizedTenant = {
  tenantId: Types.ObjectId
  membershipId: Types.ObjectId
  role: MembershipRole
}
