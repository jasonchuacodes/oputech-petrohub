-- Drop TimesheetStatus enum and remove status column from Timesheet table
-- First drop the status column which uses the enum
ALTER TABLE "Timesheet" DROP COLUMN "status";

-- Then drop the enum type
DROP TYPE "TimesheetStatus";

-- Add processed column to Timesheet
ALTER TABLE "Timesheet" ADD COLUMN "processed" BOOLEAN NOT NULL DEFAULT false;

-- Create RateType enum
CREATE TYPE "RateType" AS ENUM ('HOURLY', 'DAILY');

-- Create PayrollPeriodType enum
CREATE TYPE "PayrollPeriodType" AS ENUM ('WEEKLY');

-- Create UserSalaryRate table
CREATE TABLE "UserSalaryRate" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "rate" DECIMAL(10,2) NOT NULL,
    "rateType" "RateType" NOT NULL DEFAULT 'DAILY',
    "effectiveFrom" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserSalaryRate_pkey" PRIMARY KEY ("id")
);

-- Create Payroll table
CREATE TABLE "Payroll" (
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
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Payroll_pkey" PRIMARY KEY ("id")
);

-- Create PayrollTimesheet junction table
CREATE TABLE "PayrollTimesheet" (
    "payrollId" TEXT NOT NULL,
    "timesheetId" TEXT NOT NULL,
    "hoursSnapshot" DOUBLE PRECISION NOT NULL,
    "compensationSnapshot" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "PayrollTimesheet_pkey" PRIMARY KEY ("payrollId","timesheetId")
);

-- Create indexes for UserSalaryRate
CREATE INDEX "UserSalaryRate_userId_tenantId_effectiveFrom_idx" ON "UserSalaryRate"("userId", "tenantId", "effectiveFrom");
CREATE INDEX "UserSalaryRate_tenantId_idx" ON "UserSalaryRate"("tenantId");

-- Create indexes for Payroll
CREATE INDEX "Payroll_tenantId_userId_idx" ON "Payroll"("tenantId", "userId");
CREATE INDEX "Payroll_tenantId_periodStart_periodEnd_idx" ON "Payroll"("tenantId", "periodStart", "periodEnd");
CREATE INDEX "Payroll_userId_periodStart_idx" ON "Payroll"("userId", "periodStart");

-- Create indexes for PayrollTimesheet
CREATE INDEX "PayrollTimesheet_payrollId_idx" ON "PayrollTimesheet"("payrollId");
CREATE INDEX "PayrollTimesheet_timesheetId_idx" ON "PayrollTimesheet"("timesheetId");

-- Add foreign key constraints for UserSalaryRate
ALTER TABLE "UserSalaryRate" ADD CONSTRAINT "UserSalaryRate_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "UserSalaryRate" ADD CONSTRAINT "UserSalaryRate_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Add foreign key constraints for Payroll
ALTER TABLE "Payroll" ADD CONSTRAINT "Payroll_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Payroll" ADD CONSTRAINT "Payroll_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Add foreign key constraints for PayrollTimesheet
ALTER TABLE "PayrollTimesheet" ADD CONSTRAINT "PayrollTimesheet_payrollId_fkey" FOREIGN KEY ("payrollId") REFERENCES "Payroll"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PayrollTimesheet" ADD CONSTRAINT "PayrollTimesheet_timesheetId_fkey" FOREIGN KEY ("timesheetId") REFERENCES "Timesheet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
