import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Session, SessionSchema } from '../auth/schemas/session.schema'
import { User, UserSchema } from './schemas/user.schema'
import { UsersService } from './users.service'
import { AttendanceModule } from '../attendance/attendance.module'

@Module({
  imports: [
    AttendanceModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Session.name, schema: SessionSchema },
    ]),
  ],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
