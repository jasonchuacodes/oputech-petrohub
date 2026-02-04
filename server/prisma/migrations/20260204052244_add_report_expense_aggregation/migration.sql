-- CreateTable
CREATE TABLE "ReportExpenseAggregation" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "hourBucket" TIMESTAMP(3) NOT NULL,
    "totalAmount" DECIMAL(12,2) NOT NULL,
    "expenseCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReportExpenseAggregation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ReportExpenseAggregation_tenantId_hourBucket_idx" ON "ReportExpenseAggregation"("tenantId", "hourBucket");

-- CreateIndex
CREATE UNIQUE INDEX "ReportExpenseAggregation_tenantId_hourBucket_key" ON "ReportExpenseAggregation"("tenantId", "hourBucket");

-- AddForeignKey
ALTER TABLE "ReportExpenseAggregation" ADD CONSTRAINT "ReportExpenseAggregation_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
