-- CreateTable
CREATE TABLE "EmployeesOnReports" (
    "userId" TEXT NOT NULL,
    "reportId" TEXT NOT NULL,

    CONSTRAINT "EmployeesOnReports_pkey" PRIMARY KEY ("userId","reportId")
);

-- CreateIndex
CREATE INDEX "EmployeesOnReports_reportId_idx" ON "EmployeesOnReports"("reportId");

-- CreateIndex
CREATE INDEX "EmployeesOnReports_userId_idx" ON "EmployeesOnReports"("userId");

-- AddForeignKey
ALTER TABLE "EmployeesOnReports" ADD CONSTRAINT "EmployeesOnReports_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeesOnReports" ADD CONSTRAINT "EmployeesOnReports_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report"("id") ON DELETE CASCADE ON UPDATE CASCADE;
