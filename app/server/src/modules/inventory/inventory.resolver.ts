import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import type { Mutation as GraphqlMutation, Query as GraphqlQuery } from '../../generated/graphql'
import { ZodValidationPipe } from '../../common/validation/zod-validation.pipe'
import { AuthorizedTenant, AuthenticatedActor } from '../auth/auth.types'
import { CurrentActor } from '../auth/decorators/current-actor.decorator'
import { CurrentTenant } from '../auth/decorators/current-tenant.decorator'
import { RequireRoles, RolesGuard } from '../auth/guards/roles.guard'
import { TenantAccessGuard } from '../auth/guards/tenant-access.guard'
import { AccessTokenGuard } from '../auth/session/guards/access-token.guard'
import { UserRole } from '../users/schemas/user.schema'
import {
  createInventoryProductInputSchema,
  CreateInventoryProductInput,
  deactivateInventoryProductInputSchema,
  DeactivateInventoryProductInput,
  inventoryProductsInputSchema,
  InventoryProductsInput,
  recordStockMovementInputSchema,
  RecordStockMovementInput,
  stockMovementsInputSchema,
  StockMovementsInput,
  updateInventoryProductInputSchema,
  UpdateInventoryProductInput,
} from './inventory.schemas'
import { InventoryProductRecord, InventoryService } from './inventory.service'
import { StockMovementRecord, StockMovementService } from './stock-movement.service'

const tenantGuards = [AccessTokenGuard, TenantAccessGuard]
const adminGuards = [...tenantGuards, RolesGuard]

@Resolver()
export class InventoryResolver {
  constructor(
    private readonly inventory: InventoryService,
    private readonly stockMovements: StockMovementService,
  ) {}

  @Query('inventoryProducts')
  @UseGuards(...tenantGuards)
  async products(
    @CurrentTenant() tenant: AuthorizedTenant,
    @Args('input', new ZodValidationPipe(inventoryProductsInputSchema)) input: InventoryProductsInput,
  ): Promise<GraphqlQuery['inventoryProducts']> {
    const page = await this.inventory.list(tenant.tenantId, input)
    return { items: page.items.map((product) => this.product(product)), totalCount: page.totalCount }
  }

  @Query('stockMovements')
  @UseGuards(...tenantGuards)
  async movements(
    @CurrentTenant() tenant: AuthorizedTenant,
    @Args('input', new ZodValidationPipe(stockMovementsInputSchema)) input: StockMovementsInput,
  ): Promise<GraphqlQuery['stockMovements']> {
    const page = await this.stockMovements.list({ tenantId: tenant.tenantId, ...input })
    return { items: page.items.map((movement) => this.movement(movement)), pageInfo: page.pageInfo }
  }

  @Mutation('createInventoryProduct')
  @UseGuards(...adminGuards)
  @RequireRoles(UserRole.SUPERADMIN, UserRole.ADMIN)
  async createProduct(
    @CurrentActor() actor: AuthenticatedActor,
    @CurrentTenant() tenant: AuthorizedTenant,
    @Args('input', new ZodValidationPipe(createInventoryProductInputSchema)) input: CreateInventoryProductInput,
  ): Promise<GraphqlMutation['createInventoryProduct']> {
    return this.product(await this.inventory.createProduct(tenant.tenantId, this.actor(actor), input))
  }

  @Mutation('updateInventoryProduct')
  @UseGuards(...adminGuards)
  @RequireRoles(UserRole.SUPERADMIN, UserRole.ADMIN)
  async updateProduct(
    @CurrentTenant() tenant: AuthorizedTenant,
    @Args('input', new ZodValidationPipe(updateInventoryProductInputSchema)) input: UpdateInventoryProductInput,
  ): Promise<GraphqlMutation['updateInventoryProduct']> {
    return this.product(await this.inventory.updateProduct(tenant.tenantId, input))
  }

  @Mutation('deactivateInventoryProduct')
  @UseGuards(...adminGuards)
  @RequireRoles(UserRole.SUPERADMIN, UserRole.ADMIN)
  async deactivateProduct(
    @CurrentTenant() tenant: AuthorizedTenant,
    @Args('input', new ZodValidationPipe(deactivateInventoryProductInputSchema)) input: DeactivateInventoryProductInput,
  ): Promise<GraphqlMutation['deactivateInventoryProduct']> {
    return this.product(await this.inventory.deactivateProduct(tenant.tenantId, input))
  }

  @Mutation('recordStockMovement')
  @UseGuards(...adminGuards)
  @RequireRoles(UserRole.SUPERADMIN, UserRole.ADMIN)
  async recordMovement(
    @CurrentActor() actor: AuthenticatedActor,
    @CurrentTenant() tenant: AuthorizedTenant,
    @Args('input', new ZodValidationPipe(recordStockMovementInputSchema)) input: RecordStockMovementInput,
  ): Promise<GraphqlMutation['recordStockMovement']> {
    return this.movement(await this.stockMovements.recordManual(tenant.tenantId, this.actor(actor), input))
  }

  private actor(actor: AuthenticatedActor) {
    return { userId: actor.userId, name: actor.user.fullName || actor.user.username }
  }

  private product(product: InventoryProductRecord) {
    return { id: product._id, name: product.name, unit: product.unit, unitPrice: product.unitPrice.toString(), stockCount: product.stockCount.toString(), status: product.status, revision: product.revision }
  }

  private movement(movement: StockMovementRecord) {
    return {
      id: movement._id,
      productId: movement.productId,
      productName: movement.productName,
      unit: movement.unit,
      type: movement.type,
      quantityChange: movement.quantityChange.toString(),
      balanceBefore: movement.balanceBefore.toString(),
      balanceAfter: movement.balanceAfter.toString(),
      reason: movement.reason,
      actorName: movement.actorName,
      reportId: movement.reportId,
      createdAt: movement.createdAt.toISOString(),
    }
  }
}
