-- CreateTable
CREATE TABLE "ReportDisposal" (
    "id" TEXT NOT NULL,
    "reportId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "beforeReading" DECIMAL(12,3) NOT NULL,
    "afterReading" DECIMAL(12,3) NOT NULL,
    "netDisposal" DECIMAL(12,3) NOT NULL,
    "priceSnapshot" DECIMAL(10,2) NOT NULL,
    "totalSales" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReportDisposal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ReportDisposal_reportId_idx" ON "ReportDisposal"("reportId");

-- CreateIndex
CREATE INDEX "ReportDisposal_productId_idx" ON "ReportDisposal"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "ReportDisposal_reportId_productId_key" ON "ReportDisposal"("reportId", "productId");

-- AddForeignKey
ALTER TABLE "ReportDisposal" ADD CONSTRAINT "ReportDisposal_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportDisposal" ADD CONSTRAINT "ReportDisposal_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
