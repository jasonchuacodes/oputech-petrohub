import { randomUUID } from 'node:crypto'
import { join } from 'node:path'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { GraphQLModule } from '@nestjs/graphql'
import { LoggerModule } from 'nestjs-pino'
import { GraphqlContext } from './common/graphql/graphql-context'
import { Environment, validateEnvironment } from './config/environment'
import { CommonGraphqlModule } from './common/graphql/common-graphql.module'
import { DatabaseModule } from './database/database.module'
import { HealthModule } from './health/health.module'
import { AuthModule } from './modules/auth/auth.module'
import { MemberActivityModule } from './modules/member-activity/member-activity.module'
import { TenantModule } from './modules/tenants/tenant.module'
import { UsersModule } from './modules/users/users.module'
import { ReportsModule } from './modules/reports/reports.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validate: validateEnvironment,
    }),
    LoggerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService<Environment, true>) => ({
        pinoHttp: {
          level: config.get('LOG_LEVEL', { infer: true }),
          genReqId: (request, response) => {
            const requestId = request.headers['x-request-id'] ?? randomUUID()
            response.setHeader('x-request-id', requestId)
            return requestId
          },
          redact: {
            paths: [
              'req.headers.cookie',
              'req.headers.authorization',
              'res.headers.set-cookie',
            ],
            censor: '[REDACTED]',
          },
        },
      }),
    }),
    DatabaseModule,
    CommonGraphqlModule,
    EventEmitterModule.forRoot({ wildcard: false, delimiter: '.' }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      inject: [ConfigService],
      useFactory: (config: ConfigService<Environment, true>) => ({
        driver: ApolloDriver,
        typePaths: [join(__dirname, 'graphql/**/*.graphql')],
        path: '/graphql',
        context: ({ req, res }: GraphqlContext) => ({ req, res }),
        introspection: config.get('NODE_ENV', { infer: true }) !== 'production',
        playground: false,
      }),
    }),
    UsersModule,
    TenantModule,
    MemberActivityModule,
    ReportsModule,
    AuthModule,
    HealthModule,
  ],
})
export class AppModule {}
