import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Tenant, TenantSchema } from './schemas/tenant.schema'
import { TenantService } from './tenant.service'
import { User, UserSchema } from '../users/schemas/user.schema'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Tenant.name, schema: TenantSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  providers: [TenantService],
  exports: [TenantService],
})
export class TenantModule {}
