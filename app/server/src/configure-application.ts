import { INestApplication } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import { Logger } from 'nestjs-pino'
import { Environment } from './config/environment'
import { HttpExceptionFilter } from './common/filters/http-exception.filter'
import { NoStoreInterceptor } from './common/interceptors/no-store.interceptor'

export function configureApplication(app: INestApplication): void {
  const config = app.get(ConfigService<Environment, true>)

  app.useLogger(app.get(Logger))
  app.use(helmet({ contentSecurityPolicy: false }))
  app.use(cookieParser())
  app.enableCors({
    origin: config.get('CLIENT_ORIGIN', { infer: true }),
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['content-type', 'x-csrf-token', 'x-tenant-id', 'x-request-id'],
  })
  app.useGlobalFilters(new HttpExceptionFilter())
  app.useGlobalInterceptors(new NoStoreInterceptor())
  app.enableShutdownHooks()
}
