import { Types } from 'mongoose'
import { UserRole } from '../users/schemas/user.schema'
import { AuthenticatedUser } from '../users/users.service'
import { TenantRecord } from '../tenants/tenant.service'

export type AuthenticatedActor = {
  userId: Types.ObjectId
  user: AuthenticatedUser
  tenantDeactivationCutoffs: Array<{ tenantId: Types.ObjectId; effectiveAt: Date }>
}

export type AuthorizedTenant = {
  tenantId: Types.ObjectId
  role: UserRole
  tenant: TenantRecord
}
