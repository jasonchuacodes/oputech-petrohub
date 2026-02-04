-- CreateTable
CREATE TABLE "ReportIncomeAggregation" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "hourBucket" TIMESTAMP(3) NOT NULL,
    "totalAmount" DECIMAL(12,2) NOT NULL,
    "incomeCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReportIncomeAggregation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ReportIncomeAggregation_tenantId_hourBucket_idx" ON "ReportIncomeAggregation"("tenantId", "hourBucket");

-- CreateIndex
CREATE UNIQUE INDEX "ReportIncomeAggregation_tenantId_hourBucket_key" ON "ReportIncomeAggregation"("tenantId", "hourBucket");

-- AddForeignKey
ALTER TABLE "ReportIncomeAggregation" ADD CONSTRAINT "ReportIncomeAggregation_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
