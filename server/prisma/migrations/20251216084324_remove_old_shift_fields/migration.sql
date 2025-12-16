/*
  Warnings:

  - You are about to drop the column `shiftEnd` on the `TenantsOnUsers` table. All the data in the column will be lost.
  - You are about to drop the column `shiftStart` on the `TenantsOnUsers` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "TenantsOnUsers" DROP COLUMN "shiftEnd",
DROP COLUMN "shiftStart";
