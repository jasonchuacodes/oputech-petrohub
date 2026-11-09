import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { ReportCreatedListener } from './listeners/report-created.listener'
import { MemberActivityService } from './member-activity.service'
import { MemberActivity, MemberActivitySchema } from './schemas/member-activity.schema'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MemberActivity.name, schema: MemberActivitySchema },
    ]),
  ],
  providers: [MemberActivityService, ReportCreatedListener],
  exports: [MemberActivityService],
})
export class MemberActivityModule {}
