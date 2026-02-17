/*
  Warnings:

  - You are about to drop the `Payroll` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PayrollTimesheet` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "PayrollRunStatus" AS ENUM ('PENDING', 'PAID', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('UNPAID', 'PAID', 'FAILED');

-- DropForeignKey
ALTER TABLE "Payroll" DROP CONSTRAINT "Payroll_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "Payroll" DROP CONSTRAINT "Payroll_userId_fkey";

-- DropForeignKey
ALTER TABLE "PayrollTimesheet" DROP CONSTRAINT "PayrollTimesheet_payrollId_fkey";

-- DropForeignKey
ALTER TABLE "PayrollTimesheet" DROP CONSTRAINT "PayrollTimesheet_timesheetId_fkey";

-- DropTable
DROP TABLE "Payroll";

-- DropTable
DROP TABLE "PayrollTimesheet";

-- CreateTable
CREATE TABLE "PayrollRun" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "periodType" "PayrollPeriodType" NOT NULL,
    "periodStart" TIMESTAMP(3) NOT NULL,
    "periodEnd" TIMESTAMP(3) NOT NULL,
    "status" "PayrollRunStatus" NOT NULL DEFAULT 'PENDING',
    "createdBy" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PayrollRun_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payslip" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "periodType" "PayrollPeriodType" NOT NULL,
    "periodStart" TIMESTAMP(3) NOT NULL,
    "periodEnd" TIMESTAMP(3) NOT NULL,
    "totalHours" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "rateSnapshot" DECIMAL(10,2) NOT NULL,
    "rateTypeSnapshot" "RateType" NOT NULL,
    "totalCompensation" DECIMAL(10,2) NOT NULL,
    "payrollRunId" TEXT,
    "notes" TEXT,
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'UNPAID',
    "paidAt" TIMESTAMP(3),
    "paymentMethod" TEXT,
    "paymentNotes" TEXT,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Payslip_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PayslipTimesheet" (
    "payslipId" TEXT NOT NULL,
    "timesheetId" TEXT NOT NULL,
    "hoursSnapshot" DOUBLE PRECISION NOT NULL,
    "compensationSnapshot" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "PayslipTimesheet_pkey" PRIMARY KEY ("payslipId","timesheetId")
);

-- CreateIndex
CREATE INDEX "PayrollRun_tenantId_idx" ON "PayrollRun"("tenantId");

-- CreateIndex
CREATE INDEX "PayrollRun_tenantId_periodStart_periodEnd_idx" ON "PayrollRun"("tenantId", "periodStart", "periodEnd");

-- CreateIndex
CREATE INDEX "PayrollRun_tenantId_status_idx" ON "PayrollRun"("tenantId", "status");

-- CreateIndex
CREATE INDEX "PayrollRun_createdBy_idx" ON "PayrollRun"("createdBy");

-- CreateIndex
CREATE INDEX "Payslip_tenantId_userId_idx" ON "Payslip"("tenantId", "userId");

-- CreateIndex
CREATE INDEX "Payslip_tenantId_periodStart_periodEnd_idx" ON "Payslip"("tenantId", "periodStart", "periodEnd");

-- CreateIndex
CREATE INDEX "Payslip_userId_periodStart_idx" ON "Payslip"("userId", "periodStart");

-- CreateIndex
CREATE INDEX "Payslip_payrollRunId_idx" ON "Payslip"("payrollRunId");

-- CreateIndex
CREATE INDEX "Payslip_paymentStatus_idx" ON "Payslip"("paymentStatus");

-- CreateIndex
CREATE INDEX "Payslip_tenantId_paymentStatus_idx" ON "Payslip"("tenantId", "paymentStatus");

-- CreateIndex
CREATE INDEX "PayslipTimesheet_payslipId_idx" ON "PayslipTimesheet"("payslipId");

-- CreateIndex
CREATE INDEX "PayslipTimesheet_timesheetId_idx" ON "PayslipTimesheet"("timesheetId");

-- AddForeignKey
ALTER TABLE "PayrollRun" ADD CONSTRAINT "PayrollRun_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PayrollRun" ADD CONSTRAINT "PayrollRun_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payslip" ADD CONSTRAINT "Payslip_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payslip" ADD CONSTRAINT "Payslip_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payslip" ADD CONSTRAINT "Payslip_payrollRunId_fkey" FOREIGN KEY ("payrollRunId") REFERENCES "PayrollRun"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PayslipTimesheet" ADD CONSTRAINT "PayslipTimesheet_payslipId_fkey" FOREIGN KEY ("payslipId") REFERENCES "Payslip"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PayslipTimesheet" ADD CONSTRAINT "PayslipTimesheet_timesheetId_fkey" FOREIGN KEY ("timesheetId") REFERENCES "Timesheet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
