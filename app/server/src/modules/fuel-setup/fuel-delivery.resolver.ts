import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { Types } from 'mongoose'
import { ZodValidationPipe } from '../../common/validation/zod-validation.pipe'
import type { Mutation as GraphqlMutation, Query as GraphqlQuery } from '../../generated/graphql'
import { AuthorizedTenant, AuthenticatedActor } from '../auth/auth.types'
import { CurrentActor } from '../auth/decorators/current-actor.decorator'
import { CurrentTenant } from '../auth/decorators/current-tenant.decorator'
import { RequireRoles, RolesGuard } from '../auth/guards/roles.guard'
import { TenantAccessGuard } from '../auth/guards/tenant-access.guard'
import { AccessTokenGuard } from '../auth/session/guards/access-token.guard'
import { UserRole } from '../users/schemas/user.schema'
import {
  createFuelDeliveryInputSchema,
  CreateFuelDeliveryInput,
  deleteFuelDeliveryInputSchema,
  DeleteFuelDeliveryInput,
  fuelDeliveriesInputSchema,
  FuelDeliveriesInput,
  updateFuelDeliveryInputSchema,
  UpdateFuelDeliveryInput,
} from './fuel-delivery.schemas'
import { FuelDeliveryRecord, FuelDeliveryService } from './fuel-delivery.service'
import { FuelDeliveryEventType } from './schemas/fuel-delivery.schema'

const tenantGuards = [AccessTokenGuard, TenantAccessGuard]
const writeGuards = [...tenantGuards, RolesGuard]

@Resolver()
export class FuelDeliveryResolver {
  constructor(private readonly deliveries: FuelDeliveryService) {}

  @Query('fuelDeliveries')
  @UseGuards(...tenantGuards)
  async list(
    @CurrentActor() actor: AuthenticatedActor,
    @CurrentTenant() tenant: AuthorizedTenant,
    @Args('input', new ZodValidationPipe(fuelDeliveriesInputSchema)) input: FuelDeliveriesInput,
  ): Promise<GraphqlQuery['fuelDeliveries']> {
    const page = await this.deliveries.list(tenant.tenantId, input)
    return {
      items: page.items.map((item) => this.delivery(item, this.canManage(item, actor.userId, tenant.role))),
      totalCount: page.totalCount,
    }
  }

  @Mutation('createFuelDelivery')
  @UseGuards(...writeGuards)
  @RequireRoles(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.MEMBER)
  async create(
    @CurrentActor() actor: AuthenticatedActor,
    @CurrentTenant() tenant: AuthorizedTenant,
    @Args('input', new ZodValidationPipe(createFuelDeliveryInputSchema)) input: CreateFuelDeliveryInput,
  ): Promise<GraphqlMutation['createFuelDelivery']> {
    return this.delivery(await this.deliveries.create(tenant.tenantId, this.actor(actor, tenant.role), input), true)
  }

  @Mutation('updateFuelDelivery')
  @UseGuards(...writeGuards)
  @RequireRoles(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.MEMBER)
  async update(
    @CurrentActor() actor: AuthenticatedActor,
    @CurrentTenant() tenant: AuthorizedTenant,
    @Args('input', new ZodValidationPipe(updateFuelDeliveryInputSchema)) input: UpdateFuelDeliveryInput,
  ): Promise<GraphqlMutation['updateFuelDelivery']> {
    return this.delivery(await this.deliveries.update(tenant.tenantId, this.actor(actor, tenant.role), input), true)
  }

  @Mutation('deleteFuelDelivery')
  @UseGuards(...writeGuards)
  @RequireRoles(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.MEMBER)
  async delete(
    @CurrentActor() actor: AuthenticatedActor,
    @CurrentTenant() tenant: AuthorizedTenant,
    @Args('input', new ZodValidationPipe(deleteFuelDeliveryInputSchema)) input: DeleteFuelDeliveryInput,
  ): Promise<GraphqlMutation['deleteFuelDelivery']> {
    return this.delivery(await this.deliveries.delete(tenant.tenantId, this.actor(actor, tenant.role), input), true)
  }

  private actor(actor: AuthenticatedActor, role: UserRole) {
    return { userId: actor.userId, name: actor.user.fullName || actor.user.username, role }
  }

  private delivery(delivery: FuelDeliveryRecord, canManage: boolean) {
    return {
      id: delivery._id,
      eventType: delivery.eventType ?? FuelDeliveryEventType.DELIVERY,
      canManage,
      deliveryDate: delivery.deliveryDate,
      lines: delivery.lines.map((line) => ({ ...line, quantity: line.quantity.toString() })),
      readings: delivery.readings.map((reading) => ({
        ...reading,
        beforeReading: reading.beforeReading?.toString(),
        afterReading: reading.afterReading.toString(),
      })),
      notes: delivery.notes,
      createdByName: delivery.createdByName,
      updatedByName: delivery.updatedByName,
      createdAt: delivery.createdAt.toISOString(),
      updatedAt: delivery.updatedAt.toISOString(),
      revision: delivery.revision,
    }
  }

  private canManage(delivery: FuelDeliveryRecord, userId: Types.ObjectId, role: UserRole) {
    return role === UserRole.ADMIN || role === UserRole.SUPERADMIN || delivery.createdById.equals(userId)
  }
}
