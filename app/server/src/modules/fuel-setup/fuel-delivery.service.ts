import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { ConflictException, ForbiddenException, InvalidInputException, NotFoundException } from '../../common/exceptions'
import { decimal, decimal128 } from '../../common/numeric/decimal'
import { UserRole } from '../users/schemas/user.schema'
import {
  CreateFuelDeliveryInput,
  DeleteFuelDeliveryInput,
  FuelDeliveriesInput,
  UpdateFuelDeliveryInput,
} from './fuel-delivery.schemas'
import { FuelDelivery, FuelDeliveryEventType } from './schemas/fuel-delivery.schema'
import { FuelProduct, FuelSetupStatus } from './schemas/fuel-product.schema'
import { FuelTank } from './schemas/fuel-tank.schema'

export type FuelDeliveryActor = { userId: Types.ObjectId; name: string; role: UserRole }
export type FuelDeliveryRecord = FuelDelivery & { _id: Types.ObjectId }
type ProductRecord = FuelProduct & { _id: Types.ObjectId }
type TankRecord = FuelTank & { _id: Types.ObjectId }

@Injectable()
export class FuelDeliveryService {
  constructor(
    @InjectModel(FuelDelivery.name) private readonly deliveries: Model<FuelDelivery>,
    @InjectModel(FuelProduct.name) private readonly products: Model<FuelProduct>,
    @InjectModel(FuelTank.name) private readonly tanks: Model<FuelTank>,
  ) {}

  async list(tenantId: Types.ObjectId, input: FuelDeliveriesInput) {
    const filter = { tenantId, deletedAt: { $exists: false } }
    const [items, totalCount] = await Promise.all([
      this.deliveries
        .find(filter)
        .sort({ deliveryDate: -1, createdAt: -1, _id: -1 })
        .skip(input.offset)
        .limit(input.limit)
        .lean<FuelDeliveryRecord[]>()
        .exec(),
      this.deliveries.countDocuments(filter).exec(),
    ])
    return { items, totalCount }
  }

  async create(tenantId: Types.ObjectId, actor: FuelDeliveryActor, input: CreateFuelDeliveryInput) {
    const existing = await this.deliveries
      .findOne({ tenantId, idempotencyKey: input.idempotencyKey })
      .lean<FuelDeliveryRecord>()
      .exec()
    if (existing) return this.assertMatchingCreate(existing, input, actor.userId)

    const snapshots = await this.createSnapshots(tenantId, input)
    try {
      const delivery = await this.deliveries.create({
        tenantId,
        deliveryDate: input.deliveryDate,
        eventType: FuelDeliveryEventType.DELIVERY,
        ...snapshots,
        notes: input.notes,
        createdById: actor.userId,
        createdByName: actor.name,
        idempotencyKey: input.idempotencyKey,
      })
      return delivery.toObject<FuelDeliveryRecord>()
    } catch (error) {
      if (!isDuplicateKeyError(error)) throw error
      const winner = await this.deliveries
        .findOne({ tenantId, idempotencyKey: input.idempotencyKey })
        .lean<FuelDeliveryRecord>()
        .exec()
      if (!winner) throw new ConflictException('Unable to record this fuel delivery.')
      return this.assertMatchingCreate(winner, input, actor.userId)
    }
  }

  async update(tenantId: Types.ObjectId, actor: FuelDeliveryActor, input: UpdateFuelDeliveryInput) {
    const existing = await this.deliveries
      .findOne({ _id: input.deliveryId, tenantId, deletedAt: { $exists: false } })
      .lean<FuelDeliveryRecord>()
      .exec()
    if (!existing) throw new NotFoundException('Fuel delivery not found.')
    this.assertAuthorized(existing, actor, 'edit')
    if (existing.eventType === FuelDeliveryEventType.MANUAL_OVERRIDE) {
      throw new InvalidInputException('Manual reading overrides are managed through fuel tank settings.')
    }
    if (existing.revision !== input.expectedRevision) {
      throw new ConflictException('Fuel delivery changed. Refresh and try again.')
    }
    this.assertSameReferences(existing, input)
    this.assertReadingOrder(input.readings)

    const linesByProduct = new Map(existing.lines.map((line) => [line.productId.toHexString(), line]))
    const readingsByTank = new Map(existing.readings.map((reading) => [reading.tankId.toHexString(), reading]))
    const updated = await this.deliveries.findOneAndUpdate(
      {
        _id: input.deliveryId,
        tenantId,
        revision: input.expectedRevision,
        deletedAt: { $exists: false },
        ...(this.isAdministrator(actor) ? {} : { createdById: actor.userId }),
      },
      {
        $set: {
          deliveryDate: input.deliveryDate,
          lines: input.lines.map((line) => ({
            productId: line.productId,
            productName: linesByProduct.get(line.productId.toHexString())!.productName,
            quantity: decimal128(line.quantity),
          })),
          readings: input.readings.map((reading) => {
            const snapshot = readingsByTank.get(reading.tankId.toHexString())!
            return {
              tankId: reading.tankId,
              tankLabel: snapshot.tankLabel,
              productId: snapshot.productId,
              productName: snapshot.productName,
              beforeReading: decimal128(reading.beforeReading),
              afterReading: decimal128(reading.afterReading),
            }
          }),
          ...(input.notes ? { notes: input.notes } : {}),
          updatedById: actor.userId,
          updatedByName: actor.name,
        },
        ...(input.notes ? {} : { $unset: { notes: 1 } }),
        $inc: { revision: 1 },
      },
      { new: true, runValidators: true },
    ).lean<FuelDeliveryRecord>().exec()
    if (!updated) throw new ConflictException('Fuel delivery changed. Refresh and try again.')
    return updated
  }

  async delete(tenantId: Types.ObjectId, actor: FuelDeliveryActor, input: DeleteFuelDeliveryInput) {
    const existing = await this.deliveries
      .findOne({ _id: input.deliveryId, tenantId, deletedAt: { $exists: false } })
      .select({ createdById: 1, eventType: 1, revision: 1 })
      .lean<Pick<FuelDeliveryRecord, 'createdById' | 'eventType' | 'revision'>>()
      .exec()
    if (!existing) throw new NotFoundException('Fuel delivery not found.')
    this.assertAuthorized(existing, actor, 'delete')
    if (existing.eventType === FuelDeliveryEventType.MANUAL_OVERRIDE) {
      throw new InvalidInputException('Manual reading overrides cannot be deleted from delivery history.')
    }
    if (existing.revision !== input.expectedRevision) {
      throw new ConflictException('Fuel delivery changed. Refresh and try again.')
    }
    const deleted = await this.deliveries.findOneAndUpdate(
      {
        _id: input.deliveryId,
        tenantId,
        revision: input.expectedRevision,
        deletedAt: { $exists: false },
        ...(this.isAdministrator(actor) ? {} : { createdById: actor.userId }),
      },
      {
        $set: {
          deletedAt: new Date(),
          deletedById: actor.userId,
          deletedByName: actor.name,
        },
        $inc: { revision: 1 },
      },
      { new: true, runValidators: true },
    ).lean<FuelDeliveryRecord>().exec()
    if (deleted) return deleted
    throw new ConflictException('Fuel delivery changed. Refresh and try again.')
  }

  private async createSnapshots(tenantId: Types.ObjectId, input: CreateFuelDeliveryInput) {
    this.assertUnique(input.lines.map((line) => line.productId), 'Each delivered product can only be entered once.')
    this.assertUnique(input.readings.map((reading) => reading.tankId), 'Each tank can only be entered once.')
    this.assertReadingOrder(input.readings)

    const productIds = input.lines.map((line) => line.productId)
    const products = await this.products.find({
      _id: { $in: productIds },
      tenantId,
      status: FuelSetupStatus.ACTIVE,
    }).lean<ProductRecord[]>().exec()
    if (products.length !== productIds.length) throw new InvalidInputException('Select active fuel products.')
    const productsById = new Map(products.map((product) => [product._id.toHexString(), product]))

    const tanks = await this.tanks.find({
      tenantId,
      productId: { $in: productIds },
      status: FuelSetupStatus.ACTIVE,
    }).sort({ label: 1 }).lean<TankRecord[]>().exec()
    const expectedTankIds = new Set(tanks.map((tank) => tank._id.toHexString()))
    const submittedTankIds = new Set(input.readings.map((reading) => reading.tankId.toHexString()))
    if (!sameSet(expectedTankIds, submittedTankIds)) {
      throw new InvalidInputException('Enter before and after readings for every active tank assigned to the delivered products.')
    }
    const tanksById = new Map(tanks.map((tank) => [tank._id.toHexString(), tank]))

    return {
      lines: input.lines.map((line) => ({
        productId: line.productId,
        productName: productsById.get(line.productId.toHexString())!.name,
        quantity: decimal128(line.quantity),
      })),
      readings: input.readings.map((reading) => {
        const tank = tanksById.get(reading.tankId.toHexString())!
        const product = productsById.get(tank.productId.toHexString())!
        return {
          tankId: tank._id,
          tankLabel: tank.label,
          productId: product._id,
          productName: product.name,
          beforeReading: decimal128(reading.beforeReading),
          afterReading: decimal128(reading.afterReading),
        }
      }),
    }
  }

  private assertMatchingCreate(existing: FuelDeliveryRecord, input: CreateFuelDeliveryInput, actorId: Types.ObjectId) {
    if (
      !existing.createdById.equals(actorId) ||
      existing.deletedAt ||
      existing.deliveryDate !== input.deliveryDate ||
      existing.notes !== input.notes ||
      !sameDecimalEntries(existing.lines, input.lines) ||
      !sameReadings(existing, input)
    ) throw new ConflictException('This idempotency key was already used for another fuel delivery.')
    return existing
  }

  private assertSameReferences(existing: FuelDeliveryRecord, input: UpdateFuelDeliveryInput) {
    this.assertUnique(input.lines.map((line) => line.productId), 'Each delivered product can only be entered once.')
    this.assertUnique(input.readings.map((reading) => reading.tankId), 'Each tank can only be entered once.')
    const existingProducts = new Set(existing.lines.map((line) => line.productId.toHexString()))
    const inputProducts = new Set(input.lines.map((line) => line.productId.toHexString()))
    const existingTanks = new Set(existing.readings.map((reading) => reading.tankId.toHexString()))
    const inputTanks = new Set(input.readings.map((reading) => reading.tankId.toHexString()))
    if (!sameSet(existingProducts, inputProducts) || !sameSet(existingTanks, inputTanks)) {
      throw new InvalidInputException('Delivered products and tanks cannot be changed. Delete this record and create a new one instead.')
    }
  }

  private assertReadingOrder(readings: Array<{ beforeReading: string; afterReading: string }>) {
    if (readings.some((reading) => decimal(reading.afterReading).lessThan(decimal(reading.beforeReading)))) {
      throw new InvalidInputException('After readings cannot be lower than before readings for a fuel delivery.')
    }
  }

  private assertUnique(ids: Types.ObjectId[], message: string) {
    if (new Set(ids.map((id) => id.toHexString())).size !== ids.length) throw new InvalidInputException(message)
  }

  private assertAuthorized(
    delivery: Pick<FuelDeliveryRecord, 'createdById'>,
    actor: FuelDeliveryActor,
    action: 'edit' | 'delete',
  ) {
    if (!this.isAdministrator(actor) && !delivery.createdById.equals(actor.userId)) {
      throw new ForbiddenException(`Only the delivery creator or an administrator can ${action} this fuel delivery.`)
    }
  }

  private isAdministrator(actor: FuelDeliveryActor) {
    return actor.role === UserRole.ADMIN || actor.role === UserRole.SUPERADMIN
  }
}

function sameSet(left: Set<string>, right: Set<string>) {
  return left.size === right.size && [...left].every((value) => right.has(value))
}

function sameDecimalEntries(
  stored: Array<{ productId: Types.ObjectId; quantity: Types.Decimal128 }>,
  submitted: Array<{ productId: Types.ObjectId; quantity: string }>,
) {
  const byId = new Map(stored.map((entry) => [entry.productId.toHexString(), entry.quantity]))
  return byId.size === submitted.length && submitted.every((entry) => {
    const value = byId.get(entry.productId.toHexString())
    return value !== undefined && decimal(value).equals(entry.quantity)
  })
}

function sameReadings(existing: FuelDeliveryRecord, input: CreateFuelDeliveryInput) {
  const byTank = new Map(existing.readings.map((reading) => [reading.tankId.toHexString(), reading]))
  return byTank.size === input.readings.length && input.readings.every((reading) => {
    const stored = byTank.get(reading.tankId.toHexString())
    return stored !== undefined && stored.beforeReading !== undefined &&
      decimal(stored.beforeReading).equals(reading.beforeReading) &&
      decimal(stored.afterReading).equals(reading.afterReading)
  })
}

function isDuplicateKeyError(error: unknown): error is { code: number } {
  return typeof error === 'object' && error !== null && 'code' in error && error.code === 11000
}
