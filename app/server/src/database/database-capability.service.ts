import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common'
import { InjectConnection } from '@nestjs/mongoose'
import { Connection } from 'mongoose'

@Injectable()
export class DatabaseCapabilityService implements OnApplicationBootstrap {
  private readonly logger = new Logger(DatabaseCapabilityService.name)

  constructor(@InjectConnection() private readonly connection: Connection) {}

  async onApplicationBootstrap(): Promise<void> {
    const database = this.connection.db
    if (!database) throw new Error('MongoDB connection is not ready')

    const hello = (await database.admin().command({ hello: 1 })) as { setName?: string }
    if (!hello.setName) {
      throw new Error('MongoDB must run as a replica set because report writes use transactions')
    }

    this.logger.log(`Connected to MongoDB replica set ${hello.setName}`)
  }
}
