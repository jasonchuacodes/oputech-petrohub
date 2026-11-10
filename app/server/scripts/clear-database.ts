import 'reflect-metadata'
import { NestFactory } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'
import { getConnectionToken } from '@nestjs/mongoose'
import { Connection, Types } from 'mongoose'
import { AppModule } from '../src/app.module'
import { Environment } from '../src/config/environment'
import { TenantService } from '../src/modules/tenants/tenant.service'

const collectionFlags = {
  '--member-activities': 'memberActivities',
  '--sessions': 'sessions',
  '--tenants': 'tenants',
  '--users': 'users',
} as const

type CollectionName = (typeof collectionFlags)[keyof typeof collectionFlags]

async function clearDatabase(): Promise<void> {
  const selected = parseCollectionFlags(process.argv.slice(2))
  const application = await NestFactory.createApplicationContext(AppModule, { logger: false })

  try {
    const config = application.get<ConfigService<Environment, true>>(ConfigService)
    if (config.get('NODE_ENV', { infer: true }) === 'production') {
      throw new Error('Database clearing is disabled in production.')
    }

    const connection = application.get<Connection>(getConnectionToken())
    const results = new Map<CollectionName, number>()

    if (selected.has('tenants')) {
      const tenantService = application.get(TenantService)
      const tenantIds = await connection
        .collection('tenants')
        .find({}, { projection: { _id: 1 } })
        .map((tenant) => tenant._id as Types.ObjectId)
        .toArray()

      for (const tenantId of tenantIds) {
        const deleted = await tenantService.hardDelete(tenantId)
        addResult(results, 'tenants', deleted.tenants)
        addResult(results, 'memberActivities', deleted.memberActivities)
        addResult(results, 'sessions', deleted.sessions)
        addResult(results, 'users', deleted.users)
      }
    }

    for (const collectionName of deletionOrder(selected)) {
      if (collectionName === 'tenants') continue
      const deleted = await connection.collection(collectionName).deleteMany({})
      addResult(results, collectionName, deleted.deletedCount)
    }

    for (const collectionName of displayOrder(selected, results)) {
      console.log(`${collectionName}: deleted ${results.get(collectionName) ?? 0}`)
    }
  } finally {
    await application.close()
  }
}

function parseCollectionFlags(args: string[]): Set<CollectionName> {
  args = args.filter((argument) => argument !== '--')
  if (args.length === 0) throw new Error(`Select collections to clear. ${usage()}`)
  if (args.includes('--all')) {
    if (args.length !== 1) throw new Error('--all cannot be combined with collection flags.')
    return new Set(Object.values(collectionFlags))
  }

  const selected = new Set<CollectionName>()
  for (const argument of args) {
    const collectionName = collectionFlags[argument as keyof typeof collectionFlags]
    if (!collectionName) throw new Error(`Unknown collection flag: ${argument}. ${usage()}`)
    selected.add(collectionName)
  }
  return selected
}

function deletionOrder(selected: Set<CollectionName>): CollectionName[] {
  return (['memberActivities', 'sessions', 'tenants', 'users'] as const).filter((name) =>
    selected.has(name),
  )
}

function displayOrder(
  selected: Set<CollectionName>,
  results: Map<CollectionName, number>,
): CollectionName[] {
  return (['users', 'tenants', 'sessions', 'memberActivities'] as const).filter(
    (name) => selected.has(name) || results.has(name),
  )
}

function addResult(
  results: Map<CollectionName, number>,
  collectionName: CollectionName,
  count: number,
): void {
  results.set(collectionName, (results.get(collectionName) ?? 0) + count)
}

function usage(): string {
  return 'Use --users, --tenants, --sessions, --member-activities, or --all.'
}

clearDatabase().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
})
