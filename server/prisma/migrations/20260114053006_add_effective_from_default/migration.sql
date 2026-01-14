/*
  Warnings:

  - Made the column `effectiveFrom` on table `ProductPrice` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "ProductPrice" ALTER COLUMN "effectiveFrom" SET NOT NULL,
ALTER COLUMN "effectiveFrom" SET DEFAULT CURRENT_TIMESTAMP;
