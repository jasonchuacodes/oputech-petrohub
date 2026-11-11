import { Injectable } from '@nestjs/common'
import { InjectConnection, InjectModel } from '@nestjs/mongoose'
import { ClientSession, Connection, Model, Types } from 'mongoose'
import { ConflictException, NotFoundException } from '../../common/exceptions'
import { decimal, decimal128 } from '../../common/numeric/decimal'
import { RecordStockMovementInput } from './inventory.schemas'
import { InventoryProduct } from './schemas/inventory-product.schema'
import { StockMovement, StockMovementType } from './schemas/stock-movement.schema'

export type InventoryActor = { userId: Types.ObjectId; name: string }
export type StockMovementRecord = StockMovement & { _id: Types.ObjectId }
type InventoryProductRecord = InventoryProduct & { _id: Types.ObjectId }
type ReportInventorySale = { productId: Types.ObjectId; productName: string; unit: string; quantity: Types.Decimal128 }

@Injectable()
export class StockMovementService {
  constructor(
    @InjectModel(InventoryProduct.name) private readonly products: Model<InventoryProduct>,
    @InjectModel(StockMovement.name) private readonly movements: Model<StockMovement>,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  async list(tenantId: Types.ObjectId, productId: Types.ObjectId, offset: number, limit: number) {
    if (!await this.products.exists({ _id: productId, tenantId })) throw new NotFoundException('Inventory product not found.')
    const filter = { tenantId, productId }
    const [items, totalCount] = await Promise.all([
      this.movements.find(filter).sort({ createdAt: -1, _id: -1 }).skip(offset).limit(limit).lean<StockMovementRecord[]>().exec(),
      this.movements.countDocuments(filter).exec(),
    ])
    return { items, totalCount }
  }

  async recordManual(tenantId: Types.ObjectId, actor: InventoryActor, input: RecordStockMovementInput) {
    const existing = await this.movements.findOne({ tenantId, idempotencyKey: input.idempotencyKey }).lean<StockMovementRecord>().exec()
    if (existing) return this.assertMatchingManual(existing, input)

    const session = await this.connection.startSession()
    let result: StockMovementRecord | undefined
    try {
      await session.withTransaction(async () => {
        const retry = await this.movements.findOne({ tenantId, idempotencyKey: input.idempotencyKey }).session(session).lean<StockMovementRecord>().exec()
        if (retry) {
          result = this.assertMatchingManual(retry, input)
          return
        }
        const movementType = input.type === 'stock_in' ? StockMovementType.STOCK_IN : StockMovementType.STOCK_OUT
        const quantityChange = movementType === StockMovementType.STOCK_IN ? input.quantity : `-${input.quantity}`
        result = await this.recordDelta({
          tenantId,
          productId: input.productId,
          type: movementType,
          quantityChange,
          reason: input.reason,
          actor,
          idempotencyKey: input.idempotencyKey,
          session,
        })
      })
    } finally {
      await session.endSession()
    }
    if (!result) throw new ConflictException('Unable to record this stock movement.')
    return result
  }

  async recordOpening(
    product: InventoryProductRecord,
    actor: InventoryActor,
    idempotencyKey: string,
    session: ClientSession,
  ) {
    const [movement] = await this.movements.create([{
      tenantId: product.tenantId,
      productId: product._id,
      productName: product.name,
      unit: product.unit,
      type: StockMovementType.OPENING,
      quantityChange: product.stockCount,
      balanceBefore: decimal128('0'),
      balanceAfter: product.stockCount,
      actorId: actor.userId,
      actorName: actor.name,
      reason: 'Opening stock',
      idempotencyKey,
    }], { session })
    if (!movement) throw new ConflictException('Unable to record opening stock.')
    return movement.toObject<StockMovementRecord>()
  }

  async applyReportSales(
    tenantId: Types.ObjectId,
    reportId: Types.ObjectId,
    sales: ReportInventorySale[],
    actor: InventoryActor,
    session: ClientSession,
  ) {
    const ordered = [...sales].sort((left, right) => left.productId.toHexString().localeCompare(right.productId.toHexString()))
    for (const sale of ordered) {
      await this.recordDelta({
        tenantId,
        productId: sale.productId,
        type: StockMovementType.REPORT_SALE,
        quantityChange: decimal(sale.quantity).negated().toFixed(),
        actor,
        reportId,
        reason: 'Lubricant sale from submitted report',
        idempotencyKey: `report-sale:${reportId.toHexString()}:${sale.productId.toHexString()}`,
        session,
      })
    }
  }

  async reverseReportSales(
    tenantId: Types.ObjectId,
    reportId: Types.ObjectId,
    sales: ReportInventorySale[],
    actor: InventoryActor,
    session: ClientSession,
  ) {
    const ordered = [...sales].sort((left, right) => left.productId.toHexString().localeCompare(right.productId.toHexString()))
    for (const sale of ordered) {
      const original = await this.movements.findOne({
        tenantId,
        idempotencyKey: `report-sale:${reportId.toHexString()}:${sale.productId.toHexString()}`,
      }).session(session).lean<StockMovementRecord>().exec()
      if (!original) throw new ConflictException('The report stock movement could not be reversed.')
      await this.recordDelta({
        tenantId,
        productId: sale.productId,
        type: StockMovementType.REPORT_REVERSAL,
        quantityChange: sale.quantity.toString(),
        actor,
        reportId,
        originalMovementId: original._id,
        reason: 'Lubricant sale reversed with report revocation',
        idempotencyKey: `report-reversal:${reportId.toHexString()}:${sale.productId.toHexString()}`,
        session,
      })
    }
  }

  async deleteForTenant(tenantId: Types.ObjectId, session: ClientSession) {
    const result = await this.movements.deleteMany({ tenantId }, { session })
    return result.deletedCount
  }

  private async recordDelta(input: {
    tenantId: Types.ObjectId
    productId: Types.ObjectId
    type: StockMovementType
    quantityChange: string
    reason?: string
    actor: InventoryActor
    reportId?: Types.ObjectId
    originalMovementId?: Types.ObjectId
    idempotencyKey: string
    session: ClientSession
  }): Promise<StockMovementRecord> {
    const existing = await this.movements.findOne({ tenantId: input.tenantId, idempotencyKey: input.idempotencyKey }).session(input.session).lean<StockMovementRecord>().exec()
    if (existing) return existing
    const product = await this.products.findOneAndUpdate(
      { _id: input.productId, tenantId: input.tenantId },
      { $inc: { stockCount: decimal128(input.quantityChange), revision: 1 } },
      { new: true, runValidators: true, session: input.session },
    ).lean<InventoryProductRecord>().exec()
    if (!product) throw new NotFoundException('Inventory product not found.')
    const balanceAfter = decimal(product.stockCount)
    const [movement] = await this.movements.create([{
      tenantId: input.tenantId,
      productId: product._id,
      productName: product.name,
      unit: product.unit,
      type: input.type,
      quantityChange: decimal128(input.quantityChange),
      balanceBefore: decimal128(balanceAfter.minus(input.quantityChange)),
      balanceAfter: product.stockCount,
      reason: input.reason,
      actorId: input.actor.userId,
      actorName: input.actor.name,
      reportId: input.reportId,
      originalMovementId: input.originalMovementId,
      idempotencyKey: input.idempotencyKey,
    }], { session: input.session })
    if (!movement) throw new ConflictException('Unable to record this stock movement.')
    return movement.toObject<StockMovementRecord>()
  }

  private assertMatchingManual(existing: StockMovementRecord, input: RecordStockMovementInput) {
    const expectedChange = input.type === StockMovementType.STOCK_IN ? input.quantity : `-${input.quantity}`
    if (
      !existing.productId.equals(input.productId) ||
      existing.type !== input.type ||
      !decimal(existing.quantityChange).equals(expectedChange) ||
      existing.reason !== input.reason
    ) throw new ConflictException('This idempotency key was already used for another stock movement.')
    return existing
  }
}
