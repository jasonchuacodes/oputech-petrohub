-- CreateTable
CREATE TABLE "ReportDisposalAggregation" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "hourBucket" TIMESTAMP(3) NOT NULL,
    "productType" "ProductType" NOT NULL,
    "totalAmount" DECIMAL(12,2) NOT NULL,
    "disposalCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReportDisposalAggregation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ReportDisposalAggregation_tenantId_hourBucket_idx" ON "ReportDisposalAggregation"("tenantId", "hourBucket");

-- CreateIndex
CREATE INDEX "ReportDisposalAggregation_tenantId_productType_idx" ON "ReportDisposalAggregation"("tenantId", "productType");

-- CreateIndex
CREATE UNIQUE INDEX "ReportDisposalAggregation_tenantId_hourBucket_productType_key" ON "ReportDisposalAggregation"("tenantId", "hourBucket", "productType");

-- AddForeignKey
ALTER TABLE "ReportDisposalAggregation" ADD CONSTRAINT "ReportDisposalAggregation_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
