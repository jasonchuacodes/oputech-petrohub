-- CreateEnum
CREATE TYPE "ProductType" AS ENUM ('GASOLINE', 'PREMIUM', 'DIESEL', 'KEROSENE');

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "type" "ProductType";

-- CreateIndex
CREATE INDEX "Product_tenantId_type_idx" ON "Product"("tenantId", "type");

-- CreateIndex
CREATE INDEX "Product_tenantId_active_idx" ON "Product"("tenantId", "active");
