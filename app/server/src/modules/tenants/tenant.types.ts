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

export type CreateTenantInput = {
  name: string
  key: string
  timezone: string
  currency: string
}
