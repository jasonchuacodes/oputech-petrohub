import 'reflect-metadata'
import { NestFactory } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'
import { AppModule } from './app.module'
import { Environment } from './config/environment'
import { configureApplication } from './configure-application'

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, { bufferLogs: true })
  const config = app.get(ConfigService<Environment, true>)

  configureApplication(app)

  await app.listen(config.get('PORT', { infer: true }), '0.0.0.0')
}

void bootstrap()
