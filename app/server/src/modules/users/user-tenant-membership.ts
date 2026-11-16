import { FilterQuery, Types } from 'mongoose'
import { User, UserStatus } from './schemas/user.schema'
import { UserTenantDeactivation } from './schemas/user-tenant-deactivation.schema'

export enum TenantUserAvailability {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export function getTenantDeactivation(
  user: Pick<User, 'tenantDeactivations'>,
  tenantId: Types.ObjectId,
): UserTenantDeactivation | undefined {
  return user.tenantDeactivations?.find((event) => event.tenantId.equals(tenantId))
}

export function isTenantMembershipActive(
  user: Pick<User, 'status' | 'tenantDeactivations'>,
  tenantId: Types.ObjectId,
  asOf = new Date(),
): boolean {
  if (user.status !== UserStatus.ACTIVE) return false
  const event = getTenantDeactivation(user, tenantId)
  return !event || event.effectiveAt.getTime() > asOf.getTime()
}

export function tenantAvailabilityFilter(
  tenantId: Types.ObjectId,
  availability: TenantUserAvailability,
  asOf: Date,
): FilterQuery<User> {
  const dueEvent = {
    $elemMatch: {
      tenantId,
      effectiveAt: { $lte: asOf },
    },
  }

  if (availability === TenantUserAvailability.INACTIVE) {
    return {
      $or: [{ status: UserStatus.DISABLED }, { tenantDeactivations: dueEvent }],
    }
  }

  return {
    status: UserStatus.ACTIVE,
    $nor: [{ tenantDeactivations: dueEvent }],
  }
}

export function activeTenantMembershipFilter(
  tenantId: Types.ObjectId,
  asOf = new Date(),
): FilterQuery<User> {
  return tenantAvailabilityFilter(tenantId, TenantUserAvailability.ACTIVE, asOf)
}
