/*
  Warnings:

  - Added the required column `tenantId` to the `Timesheet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Timesheet" ADD COLUMN     "tenantId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Timesheet" ADD CONSTRAINT "Timesheet_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
