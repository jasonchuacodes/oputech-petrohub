import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { FuelSetupModule } from '../fuel-setup/fuel-setup.module'
import { DisposalsService } from './disposals.service'
import { DisposalBatch, DisposalBatchSchema } from './schemas/disposal-batch.schema'
import { MeterHead, MeterHeadSchema } from './schemas/meter-head.schema'

@Module({
  imports: [
    FuelSetupModule,
    MongooseModule.forFeature([
      { name: DisposalBatch.name, schema: DisposalBatchSchema },
      { name: MeterHead.name, schema: MeterHeadSchema },
    ]),
  ],
  providers: [DisposalsService],
  exports: [DisposalsService],
})
export class DisposalsModule {}
