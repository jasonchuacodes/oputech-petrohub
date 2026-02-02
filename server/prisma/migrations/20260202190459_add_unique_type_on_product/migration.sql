/*
  Warnings:

  - A unique constraint covering the columns `[tenantId,name,type]` on the table `Product` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Product_tenantId_name_key";

-- CreateIndex
CREATE UNIQUE INDEX "Product_tenantId_name_type_key" ON "Product"("tenantId", "name", "type");
