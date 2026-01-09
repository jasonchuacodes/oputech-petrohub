/*
  Warnings:

  - You are about to drop the column `netTotal` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the column `totalExpenses` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the column `totalIncome` on the `Report` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Report" DROP COLUMN "netTotal",
DROP COLUMN "totalExpenses",
DROP COLUMN "totalIncome";

-- CreateTable
CREATE TABLE "ReportIncome" (
    "id" TEXT NOT NULL,
    "reportId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReportIncome_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ReportIncome_reportId_idx" ON "ReportIncome"("reportId");

-- AddForeignKey
ALTER TABLE "ReportIncome" ADD CONSTRAINT "ReportIncome_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report"("id") ON DELETE CASCADE ON UPDATE CASCADE;
