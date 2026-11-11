import { Module } from '@nestjs/common'
import { TenantModule } from '../tenants/tenant.module'
import { UsersModule } from '../users/users.module'
import { UsersResolver } from '../users/users.resolver'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { OriginGuard } from './guards/origin.guard'
import { RolesGuard } from './guards/roles.guard'
import { TenantAccessGuard } from './guards/tenant-access.guard'
import { SuperadminGuard } from './guards/superadmin.guard'
import { SessionModule } from './session/session.module'
import { TenantResolver } from './tenant.resolver'
import { ReportsModule } from '../reports/reports.module'
import { ReportsResolver } from '../reports/reports.resolver'
import { FuelSetupModule } from '../fuel-setup/fuel-setup.module'
import { FuelSetupResolver } from '../fuel-setup/fuel-setup.resolver'

@Module({
  imports: [
    SessionModule,
    UsersModule,
    TenantModule,
    ReportsModule,
    FuelSetupModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    OriginGuard,
    TenantAccessGuard,
    RolesGuard,
    SuperadminGuard,
    TenantResolver,
    UsersResolver,
    ReportsResolver,
    FuelSetupResolver,
  ],
  exports: [SessionModule, TenantAccessGuard, RolesGuard],
})
export class AuthModule {}
