-- DropForeignKey
ALTER TABLE "PayslipTimesheet" DROP CONSTRAINT "PayslipTimesheet_timesheetId_fkey";

-- AddForeignKey
ALTER TABLE "PayslipTimesheet" ADD CONSTRAINT "PayslipTimesheet_timesheetId_fkey" FOREIGN KEY ("timesheetId") REFERENCES "Timesheet"("id") ON DELETE CASCADE ON UPDATE CASCADE;
