import { Types } from 'mongoose'
import { UserRole } from '../users/schemas/user.schema'
import { SafeUser } from '../users/users.service'
import { TenantRecord } from '../tenants/tenant.service'

export type AuthenticatedActor = {
  userId: Types.ObjectId
  user: SafeUser
}

export type AuthorizedTenant = {
  tenantId: Types.ObjectId
  role: UserRole
  tenant: TenantRecord
}
