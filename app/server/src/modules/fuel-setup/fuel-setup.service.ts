import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { ClientSession, Model, Types } from 'mongoose'
import { ConflictException, InvalidInputException, NotFoundException } from '../../common/exceptions'
import { decimal, decimal128 } from '../../common/numeric/decimal'
import { MeterHead } from '../disposals/schemas/meter-head.schema'
import {
  CreateFuelProductInput,
  CreatePumpMeterInput,
  ChangeFuelPriceInput,
  DeactivateFuelSetupInput,
  UpdateFuelProductInput,
  UpdatePumpMeterInput,
} from './fuel-setup.schemas'
import { FuelProduct, FuelSetupStatus } from './schemas/fuel-product.schema'
import { FuelPriceChange, FuelPriceState } from './schemas/fuel-price-change.schema'
import { PumpMeter } from './schemas/pump-meter.schema'

export type FuelProductRecord = FuelProduct & { _id: Types.ObjectId }
export type PumpMeterRecord = PumpMeter & { _id: Types.ObjectId }
export type PumpMeterWithCurrentReading = PumpMeterRecord & { currentReading: Types.Decimal128 }
export type FuelPriceChangeRecord = FuelPriceChange & { _id: Types.ObjectId }
export type FuelProductWithPrice = FuelProductRecord & { nextPriceChange?: FuelPriceChangeRecord }
type MeterHeadRecord = MeterHead & { _id: Types.ObjectId }

@Injectable()
export class FuelSetupService {
  constructor(
    @InjectModel(FuelProduct.name) private readonly products: Model<FuelProduct>,
    @InjectModel(FuelPriceChange.name) private readonly priceChanges: Model<FuelPriceChange>,
    @InjectModel(FuelPriceState.name) private readonly priceStates: Model<FuelPriceState>,
    @InjectModel(PumpMeter.name) private readonly meters: Model<PumpMeter>,
    @InjectModel(MeterHead.name) private readonly heads: Model<MeterHead>,
  ) {}

  async list(tenantId: Types.ObjectId) {
    const [storedProducts, meters, heads] = await Promise.all([
      this.products.find({ tenantId }).sort({ status: 1, name: 1 }).lean<FuelProductRecord[]>().exec(),
      this.meters.find({ tenantId }).sort({ status: 1, label: 1 }).lean<PumpMeterRecord[]>().exec(),
      this.heads.find({ tenantId }).lean<MeterHeadRecord[]>().exec(),
    ])
    const now = new Date()
    const [pricedProducts, nextPriceChanges] = await Promise.all([
      this.withPrices(tenantId, storedProducts, now),
      this.nextPriceChanges(tenantId, storedProducts, now),
    ])
    const products = pricedProducts.map<FuelProductWithPrice>((product) => ({
      ...product,
      nextPriceChange: nextPriceChanges.get(product._id.toHexString()),
    }))
    const readingsByMeter = new Map(heads.map((head) => [head.meterId.toHexString(), head.reading]))
    return {
      products,
      meters: meters.map<PumpMeterWithCurrentReading>((meter) => ({
        ...meter,
        currentReading: readingsByMeter.get(meter._id.toHexString()) ?? meter.initialReading,
      })),
    }
  }

  async currentReading(tenantId: Types.ObjectId, meter: PumpMeterRecord) {
    const head = await this.heads.findOne({ tenantId, meterId: meter._id }).select({ reading: 1 }).lean<MeterHeadRecord>().exec()
    return head?.reading ?? meter.initialReading
  }

  async activeSnapshot(tenantId: Types.ObjectId, session: ClientSession, asOf = new Date()) {
    const [storedProducts, meters] = await Promise.all([
      this.products.find({ tenantId, status: FuelSetupStatus.ACTIVE }).session(session).lean<FuelProductRecord[]>().exec(),
      this.meters.find({ tenantId, status: FuelSetupStatus.ACTIVE }).sort({ label: 1 }).session(session).lean<PumpMeterRecord[]>().exec(),
    ])
    const products = await this.withPrices(tenantId, storedProducts, asOf, session)
    return { products, meters }
  }

  async createProduct(tenantId: Types.ObjectId, input: CreateFuelProductInput) {
    const product = await this.products.create({ tenantId, name: input.name, unitPrice: decimal128(input.unitPrice) })
    await this.priceStates.updateOne({ tenantId }, { $setOnInsert: { tenantId } }, { upsert: true })
    return product.toObject<FuelProductRecord>()
  }

  async updateProduct(tenantId: Types.ObjectId, input: UpdateFuelProductInput) {
    const product = await this.products.findOneAndUpdate(
      { _id: input.productId, tenantId, revision: input.expectedRevision, status: FuelSetupStatus.ACTIVE },
      { $set: { name: input.name }, $inc: { revision: 1 } },
      { new: true, runValidators: true },
    ).lean<FuelProductRecord>().exec()
    if (product) return product
    if (!await this.products.exists({ _id: input.productId, tenantId })) throw new NotFoundException('Fuel product not found.')
    throw new ConflictException('The fuel product changed. Refresh and try again.')
  }

  async changePrice(
    tenantId: Types.ObjectId,
    actorId: Types.ObjectId,
    input: ChangeFuelPriceInput,
    effectiveAt: Date,
    session: ClientSession,
  ): Promise<{ changed: boolean; product: FuelProductRecord }> {
    const product = await this.products.findOne({
      _id: input.productId,
      tenantId,
      revision: input.expectedRevision,
      status: FuelSetupStatus.ACTIVE,
    }).session(session).lean<FuelProductRecord>().exec()
    if (!product) {
      if (!await this.products.exists({ _id: input.productId, tenantId }).session(session)) {
        throw new NotFoundException('Fuel product not found.')
      }
      throw new ConflictException('The fuel product changed. Refresh and try again.')
    }

    const [priced] = await this.withPrices(tenantId, [product], effectiveAt, session)
    if (!priced) throw new NotFoundException('Fuel product not found.')
    if (decimal(priced.unitPrice).equals(decimal(input.unitPrice))) return { changed: false, product: priced }

    await this.priceChanges.create([{
      tenantId,
      productId: product._id,
      effectiveAt,
      effectiveDate: input.effectiveDate,
      effectiveHour: input.effectiveHour,
      unitPrice: decimal128(input.unitPrice),
      recordedById: actorId,
    }], { session })
    const updated = await this.products.findOneAndUpdate(
      { _id: product._id, tenantId, revision: input.expectedRevision, status: FuelSetupStatus.ACTIVE },
      { $inc: { revision: 1 } },
      { new: true, runValidators: true, session },
    ).lean<FuelProductRecord>().exec()
    if (!updated) throw new ConflictException('The fuel product changed. Refresh and try again.')
    const [current] = await this.withPrices(tenantId, [updated], new Date(), session)
    return { changed: true, product: current ?? updated }
  }

  async priceBoundaries(
    tenantId: Types.ObjectId,
    startAt: Date,
    endAt: Date,
    session?: ClientSession,
  ): Promise<Date[]> {
    const query = this.priceChanges
      .find({ tenantId, effectiveAt: { $gt: startAt, $lt: endAt } })
      .select({ effectiveAt: 1 })
      .sort({ effectiveAt: 1 })
    if (session) query.session(session)
    const changes = await query.lean<Array<Pick<FuelPriceChangeRecord, 'effectiveAt'>>>().exec()
    return [...new Map(changes.map((change) => [change.effectiveAt.toISOString(), change.effectiveAt])).values()]
  }

  async lockPricePlan(tenantId: Types.ObjectId, session: ClientSession): Promise<void> {
    await this.priceStates.updateOne(
      { tenantId },
      { $setOnInsert: { tenantId }, $inc: { revision: 1 } },
      { upsert: true, session },
    )
  }

  async createMeter(tenantId: Types.ObjectId, input: CreatePumpMeterInput) {
    const product = await this.products.exists({ _id: input.productId, tenantId, status: FuelSetupStatus.ACTIVE })
    if (!product) throw new InvalidInputException('Select an active fuel product.')
    const meter = await this.meters.create({
      tenantId,
      label: input.label,
      productId: input.productId,
      initialReading: decimal128(input.initialReading),
    })
    return meter.toObject<PumpMeterRecord>()
  }

  async updateMeter(tenantId: Types.ObjectId, input: UpdatePumpMeterInput) {
    const meter = await this.meters.findOneAndUpdate(
      { _id: input.meterId, tenantId, revision: input.expectedRevision, status: FuelSetupStatus.ACTIVE },
      { $set: { label: input.label }, $inc: { revision: 1 } },
      { new: true, runValidators: true },
    ).lean<PumpMeterRecord>().exec()
    if (meter) return meter
    if (!await this.meters.exists({ _id: input.meterId, tenantId })) throw new NotFoundException('Pump meter not found.')
    throw new ConflictException('Pump meter changed. Refresh and try again.')
  }

  async deactivateProduct(tenantId: Types.ObjectId, input: DeactivateFuelSetupInput) {
    const activeMeter = await this.meters.exists({ tenantId, productId: input.id, status: FuelSetupStatus.ACTIVE })
    if (activeMeter) throw new InvalidInputException('Deactivate this product’s meters first.')
    const product = await this.products.findOneAndUpdate(
      { _id: input.id, tenantId, revision: input.expectedRevision, status: FuelSetupStatus.ACTIVE },
      { $set: { status: FuelSetupStatus.INACTIVE }, $inc: { revision: 1 } },
      { new: true, runValidators: true },
    ).lean<FuelProductRecord>().exec()
    if (product) return product
    if (!await this.products.exists({ _id: input.id, tenantId })) throw new NotFoundException('Fuel product not found.')
    throw new ConflictException('Fuel product changed. Refresh and try again.')
  }

  async deactivateMeter(tenantId: Types.ObjectId, input: DeactivateFuelSetupInput) {
    const meter = await this.meters.findOneAndUpdate(
      { _id: input.id, tenantId, revision: input.expectedRevision, status: FuelSetupStatus.ACTIVE },
      { $set: { status: FuelSetupStatus.INACTIVE }, $inc: { revision: 1 } },
      { new: true, runValidators: true },
    ).lean<PumpMeterRecord>().exec()
    if (meter) return meter
    if (!await this.meters.exists({ _id: input.id, tenantId })) throw new NotFoundException('Pump meter not found.')
    throw new ConflictException('Pump meter changed. Refresh and try again.')
  }

  async deleteForTenant(tenantId: Types.ObjectId, session: ClientSession) {
    const [products, meters, priceChanges, priceStates] = await Promise.all([
      this.products.deleteMany({ tenantId }, { session }),
      this.meters.deleteMany({ tenantId }, { session }),
      this.priceChanges.deleteMany({ tenantId }, { session }),
      this.priceStates.deleteMany({ tenantId }, { session }),
    ])
    return {
      products: products.deletedCount,
      meters: meters.deletedCount,
      priceChanges: priceChanges.deletedCount,
      priceStates: priceStates.deletedCount,
    }
  }

  private async withPrices(
    tenantId: Types.ObjectId,
    products: FuelProductRecord[],
    asOf: Date,
    session?: ClientSession,
  ): Promise<FuelProductRecord[]> {
    if (products.length === 0) return []
    const productIds = products.map((product) => product._id)
    const query = this.priceChanges
      .find({ tenantId, productId: { $in: productIds }, effectiveAt: { $lte: asOf } })
      .sort({ effectiveAt: 1, createdAt: 1, _id: 1 })
    if (session) query.session(session)
    const changes = await query.lean<FuelPriceChangeRecord[]>().exec()
    const latest = new Map<string, Types.Decimal128>()
    for (const change of changes) latest.set(change.productId.toHexString(), change.unitPrice)
    return products.map((product) => ({
      ...product,
      unitPrice: latest.get(product._id.toHexString()) ?? product.unitPrice,
    }))
  }

  private async nextPriceChanges(
    tenantId: Types.ObjectId,
    products: FuelProductRecord[],
    after: Date,
  ): Promise<Map<string, FuelPriceChangeRecord>> {
    if (products.length === 0) return new Map()
    const changes = await this.priceChanges
      .find({
        tenantId,
        productId: { $in: products.map((product) => product._id) },
        effectiveAt: { $gt: after },
      })
      .sort({ effectiveAt: 1, createdAt: -1, _id: -1 })
      .lean<FuelPriceChangeRecord[]>()
      .exec()
    const nextByProduct = new Map<string, FuelPriceChangeRecord>()
    for (const change of changes) {
      const productId = change.productId.toHexString()
      if (!nextByProduct.has(productId)) nextByProduct.set(productId, change)
    }
    return nextByProduct
  }

}
