import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { MembershipsModule } from '../memberships/memberships.module'
import { TenantsModule } from '../tenants/tenants.module'
import { UsersModule } from '../users/users.module'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { CsrfGuard } from './guards/csrf.guard'
import { OriginGuard } from './guards/origin.guard'
import { RolesGuard } from './guards/roles.guard'
import { SessionGuard } from './guards/session.guard'
import { TenantAccessGuard } from './guards/tenant-access.guard'
import { Session, SessionSchema } from './schemas/session.schema'
import { SessionService } from './session.service'
import { ViewerResolver } from './viewer.resolver'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Session.name, schema: SessionSchema }]),
    UsersModule,
    MembershipsModule,
    TenantsModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    SessionService,
    SessionGuard,
    CsrfGuard,
    OriginGuard,
    TenantAccessGuard,
    RolesGuard,
    ViewerResolver,
  ],
  exports: [SessionService, SessionGuard, CsrfGuard, TenantAccessGuard, RolesGuard],
})
export class AuthModule {}
