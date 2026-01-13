-- DropIndex
DROP INDEX "Product_tenantId_code_key";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "code",
DROP COLUMN "unit";
