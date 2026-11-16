import { Types } from 'mongoose'
import { UserRole } from '../users/schemas/user.schema'

export type TenantActor = {
  userId: Types.ObjectId
  tenantDeactivationCutoffs: Array<{ tenantId: Types.ObjectId; effectiveAt: Date }>
  user: {
    role: UserRole
    accountHolderId?: Types.ObjectId
    tenantIds: Types.ObjectId[]
  }
}
