-- DropIndex
DROP INDEX "Report_tenantId_shiftDate_shiftId_key";

-- AlterTable
ALTER TABLE "Report" ADD COLUMN     "periodEnd" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "periodStart" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE INDEX "Report_tenantId_shiftDate_shiftId_periodStart_idx" ON "Report"("tenantId", "shiftDate", "shiftId", "periodStart");

-- CreateIndex for unique constraint
CREATE UNIQUE INDEX "Report_tenantId_shiftDate_shiftId_periodStart_key" ON "Report"("tenantId", "shiftDate", "shiftId", "periodStart");
