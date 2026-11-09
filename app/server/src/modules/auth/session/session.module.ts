import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { MongooseModule } from '@nestjs/mongoose'
import { Environment } from '../../../config/environment'
import { TenantModule } from '../../tenants/tenant.module'
import { UsersModule } from '../../users/users.module'
import { OriginGuard } from '../guards/origin.guard'
import { Session, SessionSchema } from '../schemas/session.schema'
import {
  ACCESS_TOKEN_AUDIENCE,
  ACCESS_TOKEN_ISSUER,
} from './session.constants'
import { SessionController } from './session.controller'
import { AccessTokenGuard } from './guards/access-token.guard'
import { RefreshTokenGuard } from './guards/refresh-token.guard'
import { SessionService } from './session.service'
import { SessionTokenService } from './session-token.service'

@Module({
  imports: [
    UsersModule,
    TenantModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService<Environment, true>) => ({
        secret: config.get('AUTH_ACCESS_TOKEN_SECRET', { infer: true }),
        signOptions: {
          algorithm: 'HS256',
          audience: ACCESS_TOKEN_AUDIENCE,
          issuer: ACCESS_TOKEN_ISSUER,
        },
      }),
    }),
    MongooseModule.forFeature([{ name: Session.name, schema: SessionSchema }]),
  ],
  controllers: [SessionController],
  providers: [
    AccessTokenGuard,
    RefreshTokenGuard,
    OriginGuard,
    SessionService,
    SessionTokenService,
  ],
  exports: [AccessTokenGuard, RefreshTokenGuard, SessionService],
})
export class SessionModule {}
