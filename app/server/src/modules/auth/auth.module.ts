import { Module } from '@nestjs/common'
import { TenantModule } from '../tenants/tenant.module'
import { UsersModule } from '../users/users.module'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { OriginGuard } from './guards/origin.guard'
import { RolesGuard } from './guards/roles.guard'
import { TenantAccessGuard } from './guards/tenant-access.guard'
import { SuperadminGuard } from './guards/superadmin.guard'
import { SessionModule } from './session/session.module'
import { TenantResolver } from './tenant.resolver'

@Module({
  imports: [
    SessionModule,
    UsersModule,
    TenantModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    OriginGuard,
    TenantAccessGuard,
    RolesGuard,
    SuperadminGuard,
    TenantResolver,
  ],
  exports: [SessionModule, TenantAccessGuard, RolesGuard],
})
export class AuthModule {}
