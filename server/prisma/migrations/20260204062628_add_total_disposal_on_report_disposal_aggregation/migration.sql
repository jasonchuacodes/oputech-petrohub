/*
  Warnings:

  - You are about to drop the column `totalAmount` on the `ReportDisposalAggregation` table. All the data in the column will be lost.
  - Added the required column `totalDisposal` to the `ReportDisposalAggregation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ReportDisposalAggregation" DROP COLUMN "totalAmount",
ADD COLUMN     "totalDisposal" DECIMAL(12,2) NOT NULL;
