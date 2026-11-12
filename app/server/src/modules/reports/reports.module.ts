import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Report, ReportSchema } from './schemas/report.schema'
import { ReportsService } from './reports.service'
import { DisposalsModule } from '../disposals/disposals.module'
import { InventoryModule } from '../inventory/inventory.module'
import { FuelSetupModule } from '../fuel-setup/fuel-setup.module'

@Module({
  imports: [DisposalsModule, FuelSetupModule, InventoryModule, MongooseModule.forFeature([{ name: Report.name, schema: ReportSchema }])],
  providers: [ReportsService],
  exports: [ReportsService],
})
export class ReportsModule {}
