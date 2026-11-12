import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { MeterHead, MeterHeadSchema } from '../disposals/schemas/meter-head.schema'
import { FuelSetupService } from './fuel-setup.service'
import { FuelProduct, FuelProductSchema } from './schemas/fuel-product.schema'
import { FuelPriceChange, FuelPriceChangeSchema, FuelPriceState, FuelPriceStateSchema } from './schemas/fuel-price-change.schema'
import { PumpMeter, PumpMeterSchema } from './schemas/pump-meter.schema'

@Module({
  imports: [MongooseModule.forFeature([
    { name: FuelProduct.name, schema: FuelProductSchema },
    { name: FuelPriceChange.name, schema: FuelPriceChangeSchema },
    { name: FuelPriceState.name, schema: FuelPriceStateSchema },
    { name: PumpMeter.name, schema: PumpMeterSchema },
    { name: MeterHead.name, schema: MeterHeadSchema },
  ])],
  providers: [FuelSetupService],
  exports: [FuelSetupService],
})
export class FuelSetupModule {}
