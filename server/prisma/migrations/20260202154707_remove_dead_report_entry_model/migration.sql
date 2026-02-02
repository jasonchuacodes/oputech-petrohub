/*
  Warnings:

  - You are about to drop the `ReportEntry` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ReportEntry" DROP CONSTRAINT "ReportEntry_productId_fkey";

-- DropForeignKey
ALTER TABLE "ReportEntry" DROP CONSTRAINT "ReportEntry_reportId_fkey";

-- AlterTable
ALTER TABLE "Report" ALTER COLUMN "periodEnd" DROP DEFAULT,
ALTER COLUMN "periodStart" DROP DEFAULT;

-- DropTable
DROP TABLE "ReportEntry";
