import { prisma } from '~/db';
import { Role, ReportStatus } from '~/db/prisma';
import { BadInputError, ConflictError, NotFoundError } from '~/errors';

interface AssignEmployeePayload {
  reportId: string;
  userId: string;
}

const assignEmployee = async ({ reportId, userId }: AssignEmployeePayload) => {
  const report = await prisma.report.findUnique({
    where: { id: reportId },
  });

  if (!report) {
    throw new NotFoundError('Report not found');
  }

  if (report.status === ReportStatus.SUBMITTED) {
    throw new ConflictError('Cannot modify submitted reports');
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { tenants: true },
  });

  if (!user) {
    throw new NotFoundError('User not found');
  }

  if (user.role !== Role.USER) {
    throw new BadInputError('Only users with USER role can be assigned as employees');
  }

  const belongsToTenant = user.tenants.some(t => t.tenantId === report.tenantId);
  if (!belongsToTenant) {
    throw new BadInputError('User does not belong to this tenant');
  }

  await prisma.employeesOnReports.create({
    data: { userId, reportId },
  });
};

const removeEmployee = async (reportId: string, userId: string) => {
  const report = await prisma.report.findUnique({
    where: { id: reportId },
  });

  if (!report) {
    throw new NotFoundError('Report not found');
  }

  if (report.status === ReportStatus.SUBMITTED) {
    throw new ConflictError('Cannot modify submitted reports');
  }

  const assignment = await prisma.employeesOnReports.findUnique({
    where: { userId_reportId: { userId, reportId } },
  });

  if (!assignment) {
    throw new NotFoundError('Employee assignment not found');
  }

  await prisma.employeesOnReports.delete({
    where: { userId_reportId: { userId, reportId } },
  });
};

export { assignEmployee, removeEmployee };
