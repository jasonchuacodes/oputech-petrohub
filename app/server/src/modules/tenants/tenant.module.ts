import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Tenant, TenantSchema } from './schemas/tenant.schema'
import { TenantService } from './tenant.service'
import { User, UserSchema } from '../users/schemas/user.schema'
import {
  MemberActivity,
  MemberActivitySchema,
} from '../member-activity/schemas/member-activity.schema'
import { Session, SessionSchema } from '../auth/schemas/session.schema'
import { ReportsModule } from '../reports/reports.module'

@Module({
  imports: [
    ReportsModule,
    MongooseModule.forFeature([
      { name: Tenant.name, schema: TenantSchema },
      { name: User.name, schema: UserSchema },
      { name: MemberActivity.name, schema: MemberActivitySchema },
      { name: Session.name, schema: SessionSchema },
    ]),
  ],
  providers: [TenantService],
  exports: [TenantService],
})
export class TenantModule {}
