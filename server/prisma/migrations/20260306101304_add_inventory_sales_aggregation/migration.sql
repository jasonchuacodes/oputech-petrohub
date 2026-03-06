-- CreateTable
CREATE TABLE "ReportInventorySalesAggregation" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "hourBucket" TIMESTAMP(3) NOT NULL,
    "totalAmount" DECIMAL(12,2) NOT NULL,
    "inventorySalesCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReportInventorySalesAggregation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ReportInventorySalesAggregation_tenantId_hourBucket_idx" ON "ReportInventorySalesAggregation"("tenantId", "hourBucket");

-- CreateIndex
CREATE UNIQUE INDEX "ReportInventorySalesAggregation_tenantId_hourBucket_key" ON "ReportInventorySalesAggregation"("tenantId", "hourBucket");

-- AddForeignKey
ALTER TABLE "ReportInventorySalesAggregation" ADD CONSTRAINT "ReportInventorySalesAggregation_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
