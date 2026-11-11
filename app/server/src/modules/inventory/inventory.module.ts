import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { InventoryService } from './inventory.service'
import { InventoryProduct, InventoryProductSchema } from './schemas/inventory-product.schema'
import { StockMovement, StockMovementSchema } from './schemas/stock-movement.schema'
import { StockMovementService } from './stock-movement.service'

@Module({
  imports: [MongooseModule.forFeature([
    { name: InventoryProduct.name, schema: InventoryProductSchema },
    { name: StockMovement.name, schema: StockMovementSchema },
  ])],
  providers: [InventoryService, StockMovementService],
  exports: [InventoryService, StockMovementService],
})
export class InventoryModule {}
