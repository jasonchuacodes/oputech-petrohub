-- CreateEnum
CREATE TYPE "ProductCategory" AS ENUM ('FUEL', 'STOCK_INVENTORY');

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "category" "ProductCategory" NOT NULL DEFAULT 'FUEL';

-- CreateTable
CREATE TABLE "StockInventory" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StockInventory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReportStockInventory" (
    "id" TEXT NOT NULL,
    "reportId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantitySold" INTEGER NOT NULL,
    "unitPriceSnapshot" DECIMAL(10,2) NOT NULL,
    "totalPrice" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReportStockInventory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StockInventory_productId_key" ON "StockInventory"("productId");

-- CreateIndex
CREATE INDEX "StockInventory_productId_idx" ON "StockInventory"("productId");

-- CreateIndex
CREATE INDEX "ReportStockInventory_reportId_idx" ON "ReportStockInventory"("reportId");

-- CreateIndex
CREATE INDEX "ReportStockInventory_productId_idx" ON "ReportStockInventory"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "ReportStockInventory_reportId_productId_key" ON "ReportStockInventory"("reportId", "productId");

-- CreateIndex
CREATE INDEX "Product_tenantId_category_idx" ON "Product"("tenantId", "category");

-- AddForeignKey
ALTER TABLE "StockInventory" ADD CONSTRAINT "StockInventory_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportStockInventory" ADD CONSTRAINT "ReportStockInventory_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportStockInventory" ADD CONSTRAINT "ReportStockInventory_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
