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
    }

    const database = connection.db
    if (!database) throw new Error('Database connection is unavailable')
    const tenants = database.collection('tenants')
    if (await tenants.indexExists('key_1')) {
      await tenants.dropIndex('key_1')
      console.log('Dropped obsolete tenants.key_1 index')
    }
    const cleanup = await tenants.updateMany(
      { key: { $exists: true } },
      { $unset: { key: '' } },
    )
    if (cleanup.modifiedCount > 0) {
      console.log(`Removed obsolete keys from ${cleanup.modifiedCount} tenant records`)
    }

    const users = database.collection('users')
    const userCleanup = await users.updateMany(
      { shouldChangePassword: { $exists: true } },
      { $unset: { shouldChangePassword: '' } },
    )
    if (userCleanup.modifiedCount > 0) {
      console.log(
        `Removed obsolete password-change flags from ${userCleanup.modifiedCount} user records`,
      )
    }

    for (const model of Object.values(connection.models)) {
      await model.createIndexes()
      console.log(`Indexes ensured for ${model.collection.collectionName}`)
    }
  } finally {
    await application.close()
  }
}

void ensureIndexes()
