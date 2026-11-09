import 'reflect-metadata'
import { NestFactory } from '@nestjs/core'
import { getConnectionToken } from '@nestjs/mongoose'
import { Connection } from 'mongoose'
import { AppModule } from '../src/app.module'

async function ensureIndexes(): Promise<void> {
  const application = await NestFactory.createApplicationContext(AppModule)

  try {
    const connection = application.get<Connection>(getConnectionToken())
    for (const model of Object.values(connection.models)) {
      await model.createCollection()
      await model.createIndexes()
      console.log(`Indexes ensured for ${model.collection.collectionName}`)
    }
  } finally {
    await application.close()
  }
}

void ensureIndexes()
