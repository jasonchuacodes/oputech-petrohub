import { Prisma, ReportStatus, Role } from '~/db/prisma';
import {
  ConflictError,
  ForbiddenError,
  NotFoundError,
} from '~/errors';

import { prisma } from '../../../db';

interface CreateReportPayload {
  tenantId: string;
  creatorId: string;
  shiftId: string;
  shiftDate: Date;
}

interface GetReportsFilters {
  tenantId: string;
  userId: string;
  userRole: Role;
  status?: ReportStatus;
  shiftDate?: Date;
  startDate?: Date;
  endDate?: Date;
  creatorId?: string;
}

const createReport = async ({
  tenantId,
  creatorId,
  shiftId,
  shiftDate,
}: CreateReportPayload) => {
  const existing = await prisma.report.findUnique({
    where: {
      tenantId_shiftDate_shiftId: { tenantId, shiftDate, shiftId },
    },
  });

  if (existing) {
    throw new ConflictError('Report for this shift and date already exists');
  }

  const shift = await prisma.shift.findFirst({
    where: { id: shiftId, tenantId },
  });

  if (!shift) {
    throw new NotFoundError('Shift not found');
  }

  return await prisma.report.create({
    data: {
      tenantId,
      creatorId,
      shiftId,
      shiftDate,
      status: ReportStatus.DRAFT,
    },
    include: {
      shift: true,
      creator: { select: { id: true, name: true } },
      entries: { include: { product: true } },
      expenses: true,
      employees: {
        include: {
          user: {
            select: { id: true, name: true, username: true },
          },
        },
      },
    },
  });
};

const getReports = async ({
  tenantId,
  userId,
  userRole,
  status,
  shiftDate,
  startDate,
  endDate,
  creatorId,
}: GetReportsFilters) => {
  const where: Prisma.ReportWhereInput = {
    tenantId,
    ...(shiftDate && { shiftDate }),
    ...(startDate || endDate
      ? {
          shiftDate: {
            ...(startDate && { gte: startDate }),
            ...(endDate && { lte: endDate }),
          },
        }
      : {}),
    ...(status && { status }),
    ...(creatorId && { creatorId }),
  };

  if (userRole === Role.USER) {
    where.OR = [
      { creatorId: userId },
      { status: ReportStatus.SUBMITTED },
    ];
  } else if (userRole === Role.ADMIN) {
    where.status = ReportStatus.SUBMITTED;
  }

  return await prisma.report.findMany({
    where,
    include: {
      creator: { select: { id: true, name: true } },
      shift: true,
      employees: {
        include: {
          user: {
            select: { id: true, name: true, username: true },
          },
        },
      },
      _count: {
        select: { entries: true, expenses: true },
      },
    },
    orderBy: { shiftDate: 'desc' },
  });
};

const getReportById = async (reportId: string) => {
  const report = await prisma.report.findUnique({
    where: { id: reportId },
    include: {
      creator: { select: { id: true, name: true } },
      shift: true,
      entries: { include: { product: true } },
      expenses: true,
      employees: {
        include: {
          user: {
            select: { id: true, name: true, username: true },
          },
        },
      },
    },
  });

  if (!report) {
    throw new NotFoundError('Report not found');
  }

  return report;
};

const validateReport = async (reportId: string, userId: string) => {
  const report = await getReportById(reportId);

  if (report.creatorId !== userId) {
    throw new ForbiddenError('Only creator can validate report');
  }

  if (report.status !== ReportStatus.DRAFT) {
    throw new ConflictError('Only draft reports can be validated');
  }

  return await prisma.report.update({
    where: { id: reportId },
    data: { status: ReportStatus.VALIDATED },
    include: {
      creator: { select: { id: true, name: true } },
      shift: true,
      entries: { include: { product: true } },
      expenses: true,
      employees: {
        include: {
          user: {
            select: { id: true, name: true, username: true },
          },
        },
      },
    },
  });
};

const submitReport = async (reportId: string, userId: string) => {
  const report = await getReportById(reportId);

  if (report.creatorId !== userId) {
    throw new ForbiddenError('Only creator can submit report');
  }

  if (report.status !== ReportStatus.VALIDATED) {
    throw new ConflictError('Only validated reports can be submitted');
  }

  return await prisma.report.update({
    where: { id: reportId },
    data: {
      status: ReportStatus.SUBMITTED,
      submittedAt: new Date(),
    },
    include: {
      creator: { select: { id: true, name: true } },
      shift: true,
      entries: { include: { product: true } },
      expenses: true,
      employees: {
        include: {
          user: {
            select: { id: true, name: true, username: true },
          },
        },
      },
    },
  });
};

export { createReport, getReports, getReportById, validateReport, submitReport };
