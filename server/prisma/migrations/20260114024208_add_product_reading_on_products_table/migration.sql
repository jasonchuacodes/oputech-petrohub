-- CreateTable
CREATE TABLE "ProductReading" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "reading" DECIMAL(12,3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductReading_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ProductReading_productId_idx" ON "ProductReading"("productId");

-- AddForeignKey
ALTER TABLE "ProductReading" ADD CONSTRAINT "ProductReading_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
