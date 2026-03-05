/*
  Warnings:

  - You are about to drop the column `position` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[tenantId,employeeId]` on the table `TenantsOnUsers` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "EmploymentStatus" AS ENUM ('REGULAR', 'PROBATIONARY', 'TERMINATED', 'RESIGNED');

-- AlterTable
ALTER TABLE "TenantsOnUsers" ADD COLUMN     "employeeId" SERIAL NOT NULL,
ADD COLUMN     "hireDate" TIMESTAMP(3),
ADD COLUMN     "position" TEXT,
ADD COLUMN     "status" "EmploymentStatus" NOT NULL DEFAULT 'PROBATIONARY';

-- AlterTable
ALTER TABLE "User" DROP COLUMN "position";

-- CreateIndex
CREATE UNIQUE INDEX "TenantsOnUsers_tenantId_employeeId_key" ON "TenantsOnUsers"("tenantId", "employeeId");
