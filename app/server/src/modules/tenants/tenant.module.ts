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
import { FuelSetupModule } from '../fuel-setup/fuel-setup.module'
import { InventoryModule } from '../inventory/inventory.module'
import { AttendanceModule } from '../attendance/attendance.module'

@Module({
  imports: [
    ReportsModule,
    FuelSetupModule,
    InventoryModule,
    AttendanceModule,
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
