import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { MeterHead, MeterHeadSchema } from '../disposals/schemas/meter-head.schema'
import { FuelSetupService } from './fuel-setup.service'
import { FuelProduct, FuelProductSchema } from './schemas/fuel-product.schema'
import { FuelPriceChange, FuelPriceChangeSchema, FuelPriceState, FuelPriceStateSchema } from './schemas/fuel-price-change.schema'
import { PumpMeter, PumpMeterSchema } from './schemas/pump-meter.schema'
import { FuelTank, FuelTankSchema } from './schemas/fuel-tank.schema'
import { FuelDelivery, FuelDeliverySchema } from './schemas/fuel-delivery.schema'
import { FuelDeliveryService } from './fuel-delivery.service'

@Module({
  imports: [MongooseModule.forFeature([
    { name: FuelProduct.name, schema: FuelProductSchema },
    { name: FuelPriceChange.name, schema: FuelPriceChangeSchema },
    { name: FuelPriceState.name, schema: FuelPriceStateSchema },
    { name: PumpMeter.name, schema: PumpMeterSchema },
    { name: FuelTank.name, schema: FuelTankSchema },
    { name: FuelDelivery.name, schema: FuelDeliverySchema },
    { name: MeterHead.name, schema: MeterHeadSchema },
  ])],
  providers: [FuelSetupService, FuelDeliveryService],
  exports: [FuelSetupService, FuelDeliveryService],
})
export class FuelSetupModule {}
