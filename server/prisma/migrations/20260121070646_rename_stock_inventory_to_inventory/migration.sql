/*
  Warnings:

  - You are about to drop the `ReportStockInventory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StockInventory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ReportStockInventory" DROP CONSTRAINT "ReportStockInventory_productId_fkey";

-- DropForeignKey
ALTER TABLE "ReportStockInventory" DROP CONSTRAINT "ReportStockInventory_reportId_fkey";

-- DropForeignKey
ALTER TABLE "StockInventory" DROP CONSTRAINT "StockInventory_productId_fkey";

-- DropTable
DROP TABLE "ReportStockInventory";

-- DropTable
DROP TABLE "StockInventory";

-- CreateTable
CREATE TABLE "Inventory" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Inventory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReportInventory" (
    "id" TEXT NOT NULL,
    "reportId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantitySold" INTEGER NOT NULL,
    "unitPriceSnapshot" DECIMAL(10,2) NOT NULL,
    "totalPrice" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReportInventory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Inventory_productId_key" ON "Inventory"("productId");

-- CreateIndex
CREATE INDEX "Inventory_productId_idx" ON "Inventory"("productId");

-- CreateIndex
CREATE INDEX "ReportInventory_reportId_idx" ON "ReportInventory"("reportId");

-- CreateIndex
CREATE INDEX "ReportInventory_productId_idx" ON "ReportInventory"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "ReportInventory_reportId_productId_key" ON "ReportInventory"("reportId", "productId");

-- AddForeignKey
ALTER TABLE "Inventory" ADD CONSTRAINT "Inventory_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportInventory" ADD CONSTRAINT "ReportInventory_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportInventory" ADD CONSTRAINT "ReportInventory_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
