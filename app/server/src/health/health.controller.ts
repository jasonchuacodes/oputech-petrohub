import { Controller, Get, ServiceUnavailableException } from '@nestjs/common'
import { InjectConnection } from '@nestjs/mongoose'
import { Connection } from 'mongoose'

@Controller('api/health')
export class HealthController {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  @Get('live')
  live() {
    return { status: 'ok' }
  }

  @Get('ready')
  async ready() {
    if (this.connection.readyState !== 1 || !this.connection.db) {
      throw new ServiceUnavailableException('Database is not ready')
    }

    const hello = (await this.connection.db.admin().command({ hello: 1 })) as { setName?: string }
    if (!hello.setName) throw new ServiceUnavailableException('Transactional database is not ready')

    return { status: 'ok' }
  }
}
