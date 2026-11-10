import { Types } from 'mongoose'
import { UserRole } from '../users/schemas/user.schema'

export type TenantActor = {
  userId: Types.ObjectId
  user: {
    role: UserRole
    accountHolderId?: Types.ObjectId
    tenantIds: Types.ObjectId[]
  }
}
