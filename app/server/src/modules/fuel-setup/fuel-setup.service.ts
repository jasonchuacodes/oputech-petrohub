import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { ClientSession, Model, Types } from 'mongoose'
import { ConflictException, InvalidInputException, NotFoundException } from '../../common/exceptions'
import { decimal128 } from '../../common/numeric/decimal'
import { MeterHead } from '../disposals/schemas/meter-head.schema'
import {
  CreateFuelProductInput,
  CreatePumpMeterInput,
  DeactivateFuelSetupInput,
  UpdateFuelProductInput,
} from './fuel-setup.schemas'
import { FuelProduct, FuelSetupStatus } from './schemas/fuel-product.schema'
import { PumpMeter } from './schemas/pump-meter.schema'

export type FuelProductRecord = FuelProduct & { _id: Types.ObjectId }
export type PumpMeterRecord = PumpMeter & { _id: Types.ObjectId }
export type PumpMeterWithCurrentReading = PumpMeterRecord & { currentReading: Types.Decimal128 }
type MeterHeadRecord = MeterHead & { _id: Types.ObjectId }

@Injectable()
export class FuelSetupService {
  constructor(
    @InjectModel(FuelProduct.name) private readonly products: Model<FuelProduct>,
    @InjectModel(PumpMeter.name) private readonly meters: Model<PumpMeter>,
    @InjectModel(MeterHead.name) private readonly heads: Model<MeterHead>,
  ) {}

  async list(tenantId: Types.ObjectId) {
    const [products, meters, heads] = await Promise.all([
      this.products.find({ tenantId }).sort({ status: 1, name: 1 }).lean<FuelProductRecord[]>().exec(),
      this.meters.find({ tenantId }).sort({ status: 1, label: 1 }).lean<PumpMeterRecord[]>().exec(),
      this.heads.find({ tenantId }).lean<MeterHeadRecord[]>().exec(),
    ])
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

  async activeSnapshot(tenantId: Types.ObjectId, session: ClientSession) {
    const [products, meters] = await Promise.all([
      this.products.find({ tenantId, status: FuelSetupStatus.ACTIVE }).session(session).lean<FuelProductRecord[]>().exec(),
      this.meters.find({ tenantId, status: FuelSetupStatus.ACTIVE }).sort({ label: 1 }).session(session).lean<PumpMeterRecord[]>().exec(),
    ])
    return { products, meters }
  }

  async createProduct(tenantId: Types.ObjectId, input: CreateFuelProductInput) {
    const product = await this.products.create({ tenantId, name: input.name, unitPrice: decimal128(input.unitPrice) })
    return product.toObject<FuelProductRecord>()
  }

  async updateProduct(tenantId: Types.ObjectId, input: UpdateFuelProductInput) {
    const product = await this.products.findOneAndUpdate(
      { _id: input.productId, tenantId, revision: input.expectedRevision, status: FuelSetupStatus.ACTIVE },
      { $set: { name: input.name, unitPrice: decimal128(input.unitPrice) }, $inc: { revision: 1 } },
      { new: true, runValidators: true },
    ).lean<FuelProductRecord>().exec()
    if (product) return product
    if (!await this.products.exists({ _id: input.productId, tenantId })) throw new NotFoundException('Fuel product not found.')
    throw new ConflictException('The fuel product changed. Refresh and try again.')
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
    const [products, meters] = await Promise.all([
      this.products.deleteMany({ tenantId }, { session }),
      this.meters.deleteMany({ tenantId }, { session }),
    ])
    return { products: products.deletedCount, meters: meters.deletedCount }
  }

}
