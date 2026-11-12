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
  createFuelProductInputSchema,
  CreateFuelProductInput,
  createPumpMeterInputSchema,
  CreatePumpMeterInput,
  deactivateFuelSetupInputSchema,
  DeactivateFuelSetupInput,
  updateFuelProductInputSchema,
  UpdateFuelProductInput,
  changeFuelPriceInputSchema,
  ChangeFuelPriceInput,
  updatePumpMeterInputSchema,
  UpdatePumpMeterInput,
} from './fuel-setup.schemas'
import { FuelProductRecord, FuelProductWithPrice, FuelSetupService, PumpMeterRecord, PumpMeterWithCurrentReading } from './fuel-setup.service'
import { ReportsService } from '../reports/reports.service'

const tenantGuards = [AccessTokenGuard, TenantAccessGuard]
const adminGuards = [...tenantGuards, RolesGuard]

@Resolver()
export class FuelSetupResolver {
  constructor(
    private readonly fuelSetup: FuelSetupService,
    private readonly reports: ReportsService,
  ) {}

  @Query('fuelSetup')
  @UseGuards(...tenantGuards)
  async list(@CurrentTenant() tenant: AuthorizedTenant): Promise<GraphqlQuery['fuelSetup']> {
    const setup = await this.fuelSetup.list(tenant.tenantId)
    return {
      products: setup.products.map((product) => this.product(product)),
      meters: setup.meters.map((meter) => this.meter(meter)),
    }
  }

  @Mutation('createFuelProduct')
  @UseGuards(...adminGuards)
  @RequireRoles(UserRole.SUPERADMIN, UserRole.ADMIN)
  async createProduct(
    @CurrentTenant() tenant: AuthorizedTenant,
    @Args('input', new ZodValidationPipe(createFuelProductInputSchema)) input: CreateFuelProductInput,
  ): Promise<GraphqlMutation['createFuelProduct']> {
    return this.product(await this.fuelSetup.createProduct(tenant.tenantId, input))
  }

  @Mutation('updateFuelProduct')
  @UseGuards(...adminGuards)
  @RequireRoles(UserRole.SUPERADMIN, UserRole.ADMIN)
  async updateProduct(
    @CurrentTenant() tenant: AuthorizedTenant,
    @Args('input', new ZodValidationPipe(updateFuelProductInputSchema)) input: UpdateFuelProductInput,
  ): Promise<GraphqlMutation['updateFuelProduct']> {
    return this.product(await this.fuelSetup.updateProduct(tenant.tenantId, input))
  }

  @Mutation('changeFuelPrice')
  @UseGuards(...adminGuards)
  @RequireRoles(UserRole.SUPERADMIN, UserRole.ADMIN)
  async changePrice(
    @CurrentActor() actor: AuthenticatedActor,
    @CurrentTenant() tenant: AuthorizedTenant,
    @Args('input', new ZodValidationPipe(changeFuelPriceInputSchema)) input: ChangeFuelPriceInput,
  ): Promise<GraphqlMutation['changeFuelPrice']> {
    const product = await this.reports.changeFuelPrice(
      { tenantId: tenant.tenantId, timezone: tenant.tenant.timezone },
      actor.userId,
      input,
    )
    return this.product(product)
  }

  @Mutation('deactivateFuelProduct')
  @UseGuards(...adminGuards)
  @RequireRoles(UserRole.SUPERADMIN, UserRole.ADMIN)
  async deactivateProduct(
    @CurrentTenant() tenant: AuthorizedTenant,
    @Args('input', new ZodValidationPipe(deactivateFuelSetupInputSchema)) input: DeactivateFuelSetupInput,
  ): Promise<GraphqlMutation['deactivateFuelProduct']> {
    return this.product(await this.fuelSetup.deactivateProduct(tenant.tenantId, input))
  }

  @Mutation('createPumpMeter')
  @UseGuards(...adminGuards)
  @RequireRoles(UserRole.SUPERADMIN, UserRole.ADMIN)
  async createMeter(
    @CurrentTenant() tenant: AuthorizedTenant,
    @Args('input', new ZodValidationPipe(createPumpMeterInputSchema)) input: CreatePumpMeterInput,
  ): Promise<GraphqlMutation['createPumpMeter']> {
    const meter = await this.fuelSetup.createMeter(tenant.tenantId, input)
    return this.meter(meter, await this.fuelSetup.currentReading(tenant.tenantId, meter))
  }

  @Mutation('updatePumpMeter')
  @UseGuards(...adminGuards)
  @RequireRoles(UserRole.SUPERADMIN, UserRole.ADMIN)
  async updateMeter(
    @CurrentTenant() tenant: AuthorizedTenant,
    @Args('input', new ZodValidationPipe(updatePumpMeterInputSchema)) input: UpdatePumpMeterInput,
  ): Promise<GraphqlMutation['updatePumpMeter']> {
    const meter = await this.fuelSetup.updateMeter(tenant.tenantId, input)
    return this.meter(meter, await this.fuelSetup.currentReading(tenant.tenantId, meter))
  }

  @Mutation('deactivatePumpMeter')
  @UseGuards(...adminGuards)
  @RequireRoles(UserRole.SUPERADMIN, UserRole.ADMIN)
  async deactivateMeter(
    @CurrentTenant() tenant: AuthorizedTenant,
    @Args('input', new ZodValidationPipe(deactivateFuelSetupInputSchema)) input: DeactivateFuelSetupInput,
  ): Promise<GraphqlMutation['deactivatePumpMeter']> {
    const meter = await this.fuelSetup.deactivateMeter(tenant.tenantId, input)
    return this.meter(meter, await this.fuelSetup.currentReading(tenant.tenantId, meter))
  }

  private product(product: FuelProductRecord | FuelProductWithPrice) {
    return {
      id: product._id,
      name: product.name,
      unitPrice: product.unitPrice.toString(),
      status: product.status,
      revision: product.revision,
      nextPriceChange: 'nextPriceChange' in product && product.nextPriceChange
        ? {
            unitPrice: product.nextPriceChange.unitPrice.toString(),
            effectiveDate: product.nextPriceChange.effectiveDate,
            effectiveHour: product.nextPriceChange.effectiveHour,
          }
        : null,
    }
  }

  private meter(meter: PumpMeterRecord | PumpMeterWithCurrentReading, currentReading = 'currentReading' in meter ? meter.currentReading : meter.initialReading) {
    return { id: meter._id, label: meter.label, productId: meter.productId, initialReading: meter.initialReading.toString(), currentReading: currentReading.toString(), status: meter.status, revision: meter.revision }
  }
}
