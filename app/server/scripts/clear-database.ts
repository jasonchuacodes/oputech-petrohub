import 'reflect-metadata'
import { NestFactory } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'
import { getConnectionToken } from '@nestjs/mongoose'
import { Connection, Types } from 'mongoose'
import { AppModule } from '../src/app.module'
import { Environment } from '../src/config/environment'

const collectionFlags = {
  '--member-activities': 'memberActivities',
  '--sessions': 'sessions',
  '--reports': 'reports',
  '--disposal-batches': 'disposalBatches',
  '--meter-heads': 'meterHeads',
  '--fuel-products': 'fuelProducts',
  '--pump-meters': 'pumpMeters',
  '--inventory-products': 'inventoryProducts',
  '--stock-movements': 'stockMovements',
  '--tenants': 'tenants',
  '--users': 'users',
} as const

type CollectionName = (typeof collectionFlags)[keyof typeof collectionFlags]

async function clearDatabase(): Promise<void> {
  const arguments_ = process.argv.slice(2).filter((argument) => argument !== '--')
  const clearAll = arguments_.length === 1 && arguments_[0] === '--all'
  const selected = parseCollectionFlags(arguments_)
  if (selected.has('reports')) {
    selected.add('disposalBatches')
    selected.add('meterHeads')
    selected.add('inventoryProducts')
    selected.add('stockMovements')
  }
  const application = await NestFactory.createApplicationContext(AppModule, { logger: false })

  try {
    const config = application.get<ConfigService<Environment, true>>(ConfigService)
    if (config.get('NODE_ENV', { infer: true }) === 'production') {
      throw new Error('Database clearing is disabled in production.')
    }

    const connection = application.get<Connection>(getConnectionToken())
    if (clearAll) {
      await connection.dropDatabase()
      console.log('database: dropped all collections')
      return
    }
    const results = new Map<CollectionName, number>()

    if (selected.has('tenants')) {
      const tenantIds = await connection
        .collection<{ _id: Types.ObjectId }>('tenants')
        .find({}, { projection: { _id: 1 } })
        .map((tenant) => tenant._id)
        .toArray()

      const deleted = await clearTenants(connection, tenantIds)
      for (const [collectionName, count] of deleted) addResult(results, collectionName, count)
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

type CleanupUser = {
  _id: Types.ObjectId
  role: string
  tenantIds: Types.ObjectId[]
  currentTenantId?: Types.ObjectId
}

async function clearTenants(
  connection: Connection,
  tenantIds: Types.ObjectId[],
): Promise<Map<CollectionName, number>> {
  const results = new Map<CollectionName, number>()
  if (tenantIds.length === 0) return results
  const users = connection.collection<CleanupUser>('users')
  const assignedUsers = await users.find({ tenantIds: { $in: tenantIds } }).toArray()
  const deletedUserIds: Types.ObjectId[] = []
  let updatedAssignments = 0

  for (const user of assignedUsers) {
    const remainingTenantIds = user.tenantIds.filter(
      (assignedId) => !tenantIds.some((tenantId) => tenantId.equals(assignedId)),
    )
    if (user.role === 'member' || remainingTenantIds.length === 0) {
      deletedUserIds.push(user._id)
      continue
    }
    await users.updateOne(
      { _id: user._id },
      {
        $set: {
          tenantIds: remainingTenantIds,
          currentTenantId:
            user.currentTenantId && tenantIds.some((tenantId) => tenantId.equals(user.currentTenantId))
              ? remainingTenantIds[0]
              : user.currentTenantId,
        },
        $inc: { tenantSelectionVersion: 1 },
      },
    )
    updatedAssignments += 1
  }

  if (deletedUserIds.length > 0) {
    const sessions = await connection.collection('sessions').deleteMany({ userId: { $in: deletedUserIds } })
    const deletedUsers = await users.deleteMany({ _id: { $in: deletedUserIds } })
    addResult(results, 'sessions', sessions.deletedCount)
    addResult(results, 'users', deletedUsers.deletedCount)
  }

  await users.updateMany(
    { role: 'superadmin', currentTenantId: { $in: tenantIds } },
    { $unset: { currentTenantId: '' }, $inc: { tenantSelectionVersion: 1 } },
  )

  const tenantCollections: CollectionName[] = [
    'disposalBatches',
    'meterHeads',
    'reports',
    'fuelProducts',
    'pumpMeters',
    'inventoryProducts',
    'stockMovements',
    'memberActivities',
  ]
  for (const collectionName of tenantCollections) {
    const deleted = await connection.collection(collectionName).deleteMany({ tenantId: { $in: tenantIds } })
    addResult(results, collectionName, deleted.deletedCount)
  }
  const deletedTenants = await connection.collection('tenants').deleteMany({ _id: { $in: tenantIds } })
  addResult(results, 'tenants', deletedTenants.deletedCount)
  if (updatedAssignments > 0) console.log(`Updated ${updatedAssignments} surviving user assignments`)
  return results
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
  return (['stockMovements', 'disposalBatches', 'meterHeads', 'reports', 'inventoryProducts', 'fuelProducts', 'pumpMeters', 'memberActivities', 'sessions', 'tenants', 'users'] as const).filter((name) =>
    selected.has(name),
  )
}

function displayOrder(
  selected: Set<CollectionName>,
  results: Map<CollectionName, number>,
): CollectionName[] {
  return (['users', 'tenants', 'reports', 'disposalBatches', 'meterHeads', 'inventoryProducts', 'stockMovements', 'fuelProducts', 'pumpMeters', 'sessions', 'memberActivities'] as const).filter(
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
  return 'Use --users, --tenants, --reports, --disposal-batches, --meter-heads, --inventory-products, --stock-movements, --fuel-products, --pump-meters, --sessions, --member-activities, or --all.'
}

clearDatabase().catch((error: unknown) => {
  console.error(error instanceof Error ? error.stack ?? error.message : error)
  process.exitCode = 1
})
