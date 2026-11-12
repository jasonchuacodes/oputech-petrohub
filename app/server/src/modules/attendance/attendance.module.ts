import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { User, UserSchema } from '../users/schemas/user.schema'
import { Tenant, TenantSchema } from '../tenants/schemas/tenant.schema'
import { AttendanceAutoCheckoutJob } from './attendance-auto-checkout.job'
import { AttendanceService } from './attendance.service'
import { AttendanceSession, AttendanceSessionSchema } from './schemas/attendance-session.schema'
import { TimesheetDay, TimesheetDaySchema } from './schemas/timesheet-day.schema'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AttendanceSession.name, schema: AttendanceSessionSchema },
      { name: TimesheetDay.name, schema: TimesheetDaySchema },
      { name: User.name, schema: UserSchema },
      { name: Tenant.name, schema: TenantSchema },
    ]),
  ],
  providers: [AttendanceService, AttendanceAutoCheckoutJob],
  exports: [AttendanceService],
})
export class AttendanceModule {}
