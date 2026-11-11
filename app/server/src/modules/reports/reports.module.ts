import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Report, ReportSchema } from './schemas/report.schema'
import { ReportsService } from './reports.service'
import { DisposalsModule } from '../disposals/disposals.module'

@Module({
  imports: [DisposalsModule, MongooseModule.forFeature([{ name: Report.name, schema: ReportSchema }])],
  providers: [ReportsService],
  exports: [ReportsService],
})
export class ReportsModule {}
