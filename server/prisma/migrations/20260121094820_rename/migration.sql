/*
  Warnings:

  - You are about to drop the column `quantitySold` on the `ReportInventory` table. All the data in the column will be lost.
  - Added the required column `quantity` to the `ReportInventory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ReportInventory" DROP COLUMN "quantitySold",
ADD COLUMN     "quantity" INTEGER NOT NULL;
