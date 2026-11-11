import { Injectable } from '@nestjs/common'
import { InjectConnection, InjectModel } from '@nestjs/mongoose'
import { ClientSession, Connection, Model, Types } from 'mongoose'
import { ConflictException, InvalidInputException, NotFoundException } from '../../common/exceptions'
import { decimal128, money } from '../../common/numeric/decimal'
import {
  CreateInventoryProductInput,
  InventoryProductsInput,
  UpdateInventoryProductInput,
  DeactivateInventoryProductInput,
} from './inventory.schemas'
import { InventoryProduct, InventoryProductStatus } from './schemas/inventory-product.schema'
import { InventoryActor, StockMovementService } from './stock-movement.service'

export type InventoryProductRecord = InventoryProduct & { _id: Types.ObjectId }
export type LubricantSaleSnapshot = {
  id: string
  productId: Types.ObjectId
  productName: string
  unit: string
  quantity: Types.Decimal128
  unitPrice: Types.Decimal128
  amount: Types.Decimal128
}

@Injectable()
export class InventoryService {
  constructor(
    @InjectModel(InventoryProduct.name) private readonly products: Model<InventoryProduct>,
    @InjectConnection() private readonly connection: Connection,
    private readonly stockMovements: StockMovementService,
  ) {}

  async list(tenantId: Types.ObjectId, input: InventoryProductsInput) {
    const filter: Record<string, unknown> = { tenantId }
    if (input.activeOnly) filter.status = InventoryProductStatus.ACTIVE
    if (input.search) filter.name = { $regex: escapeRegex(input.search), $options: 'i' }
    const [items, totalCount] = await Promise.all([
      this.products.find(filter).sort({ status: 1, name: 1, _id: 1 }).skip(input.offset).limit(input.limit).lean<InventoryProductRecord[]>().exec(),
      this.products.countDocuments(filter).exec(),
    ])
    return { items, totalCount }
  }

  async createProduct(tenantId: Types.ObjectId, actor: InventoryActor, input: CreateInventoryProductInput) {
    const existingMovement = await this.connection.collection('stockMovements').findOne({ tenantId, idempotencyKey: input.idempotencyKey })
    if (existingMovement?.productId instanceof Types.ObjectId) {
      const existingProduct = await this.products.findOne({ _id: existingMovement.productId, tenantId }).lean<InventoryProductRecord>().exec()
      if (existingProduct) return existingProduct
    }

    const session = await this.connection.startSession()
    let result: InventoryProductRecord | undefined
    try {
      await session.withTransaction(async () => {
        const [product] = await this.products.create([{
          tenantId,
          name: input.name,
          unit: input.unit,
          unitPrice: decimal128(input.unitPrice),
          stockCount: decimal128(input.openingStock),
        }], { session })
        if (!product) throw new ConflictException('Unable to create this inventory product.')
        result = product.toObject<InventoryProductRecord>()
        await this.stockMovements.recordOpening(result, actor, input.idempotencyKey, session)
      })
    } finally {
      await session.endSession()
    }
    if (!result) throw new ConflictException('Unable to create this inventory product.')
    return result
  }

  async updateProduct(tenantId: Types.ObjectId, input: UpdateInventoryProductInput) {
    const product = await this.products.findOneAndUpdate(
      { _id: input.productId, tenantId, revision: input.expectedRevision, status: InventoryProductStatus.ACTIVE },
      { $set: { name: input.name, unit: input.unit, unitPrice: decimal128(input.unitPrice) }, $inc: { revision: 1 } },
      { new: true, runValidators: true },
    ).lean<InventoryProductRecord>().exec()
    if (product) return product
    if (!await this.products.exists({ _id: input.productId, tenantId })) throw new NotFoundException('Inventory product not found.')
    throw new ConflictException('The inventory product changed. Refresh and try again.')
  }

  async deactivateProduct(tenantId: Types.ObjectId, input: DeactivateInventoryProductInput) {
    const product = await this.products.findOneAndUpdate(
      { _id: input.productId, tenantId, revision: input.expectedRevision, status: InventoryProductStatus.ACTIVE },
      { $set: { status: InventoryProductStatus.INACTIVE }, $inc: { revision: 1 } },
      { new: true, runValidators: true },
    ).lean<InventoryProductRecord>().exec()
    if (product) return product
    if (!await this.products.exists({ _id: input.productId, tenantId })) throw new NotFoundException('Inventory product not found.')
    throw new ConflictException('The inventory product changed. Refresh and try again.')
  }

  async snapshotSales(
    tenantId: Types.ObjectId,
    current: LubricantSaleSnapshot[],
    submitted: Array<{ id: string; productId: Types.ObjectId; quantity: string }>,
    session: ClientSession,
  ): Promise<LubricantSaleSnapshot[]> {
    const productIds = submitted.map((sale) => sale.productId)
    if (new Set(productIds.map((id) => id.toHexString())).size !== productIds.length) {
      throw new InvalidInputException('Each lubricant product can only appear once in a report.')
    }
    const products = await this.products.find({ tenantId, _id: { $in: productIds } }).session(session).lean<InventoryProductRecord[]>().exec()
    const productsById = new Map(products.map((product) => [product._id.toHexString(), product]))
    const currentByLineId = new Map(current.map((sale) => [sale.id, sale]))
    return submitted.map((sale) => {
      const previous = currentByLineId.get(sale.id)
      const unchangedProduct = previous?.productId.equals(sale.productId)
      if (previous && unchangedProduct) {
        return {
          ...previous,
          quantity: decimal128(sale.quantity),
          amount: decimal128(money(previous.unitPrice.toString()).times(sale.quantity)),
        }
      }
      const product = productsById.get(sale.productId.toHexString())
      if (!product || product.status !== InventoryProductStatus.ACTIVE) {
        throw new InvalidInputException('Select an active lubricant product.')
      }
      return {
        id: sale.id,
        productId: product._id,
        productName: product.name,
        unit: product.unit,
        quantity: decimal128(sale.quantity),
        unitPrice: product.unitPrice,
        amount: decimal128(money(product.unitPrice.toString()).times(sale.quantity)),
      }
    })
  }

  async deleteForTenant(tenantId: Types.ObjectId, session: ClientSession) {
    const movements = await this.stockMovements.deleteForTenant(tenantId, session)
    const products = await this.products.deleteMany({ tenantId }, { session })
    return { products: products.deletedCount, movements }
  }
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
