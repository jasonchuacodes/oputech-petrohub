import { Global, Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { Environment } from '../config/environment'
import { DatabaseCapabilityService } from './database-capability.service'

@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService<Environment, true>) => ({
        uri: config.get('MONGODB_URI', { infer: true }),
        autoIndex: config.get('NODE_ENV', { infer: true }) !== 'production',
        maxPoolSize: 20,
        minPoolSize: 1,
        serverSelectionTimeoutMS: 10_000,
      }),
    }),
  ],
  providers: [DatabaseCapabilityService],
  exports: [MongooseModule],
})
export class DatabaseModule {}
