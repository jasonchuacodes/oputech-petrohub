import { Decimal } from '@prisma/client/runtime/library';
import { prisma } from '~/db';
import { Prisma, ProductCategory, ReportStatus, Role } from '~/db/prisma';
import { ConflictError, ForbiddenError, NotFoundError } from '~/errors';

import { getPaginationArgs } from '~/utils';
import { computeReportTotals } from '../utils/compute';
import { processInventoryDeductions } from './inventory.service';
import {
  aggregateReportIncome,
  deaggregateReportIncome,
} from '~/modules/analytics/services/income-aggregation.service';
import {
  aggregateReportExpense,
  deaggregateReportExpense,
} from '~/modules/analytics/services/expense-aggregation.service';
import {
  aggregateReportDisposal,
  deaggregateReportDisposal,
} from '~/modules/analytics/services/disposal-aggregation.service';
import {
  aggregateReportInventorySales,
  deaggregateReportInventorySales,
} from '~/modules/analytics/services/inventory-sales-aggregation.service';

interface CreateReportPayload {
  tenantId: string;
  creatorId: string;
  shiftId: string;
  periodStart: Date;
  periodEnd: Date;
}

interface GetReportsFilters {
  tenantId: string;
  status?: ReportStatus;
  shiftDate?: Date;
  startDate?: Date;
  endDate?: Date;
  creatorId?: string;
  page: number;
  pageSize: number;
}

const createReport = async ({
  tenantId,
  creatorId,
  shiftId,
  periodStart,
  periodEnd,
}: CreateReportPayload) => {
  const shiftDate = new Date(
    periodStart.getFullYear(),
    periodStart.getMonth(),
    periodStart.getDate(),
  );

  const existing = await prisma.report.findFirst({
    where: {
      tenantId,
      shiftDate,
      shiftId,
      periodStart,
    },
  });

  if (existing) {
    const fullReport = await prisma.report.findUnique({
      where: { id: existing.id },
      include: {
        shift: true,
        creator: { select: { id: true, name: true } },
        income: true,
        expenses: true,
        disposals: {
          include: {
            product: true,
          },
        },
        inventories: { include: { product: true } },
        employees: {
          include: {
            user: {
              select: { id: true, name: true, username: true },
            },
          },
        },
      },
    });

    if (!fullReport) {
      throw new NotFoundError('Report not found');
    }

    return {
      ...fullReport,
      ...computeReportTotals(fullReport),
    };
  }

  const shift = await prisma.shift.findFirst({
    where: { id: shiftId, tenantId },
  });

  if (!shift) {
    throw new NotFoundError('Shift not found');
  }

  const products = await prisma.product.findMany({
    where: { tenantId, category: ProductCategory.FUEL, active: true },
    include: {
      productPrices: {
        where: {
          effectiveFrom: { lte: periodStart },
        },
        orderBy: { effectiveFrom: 'desc' },
        take: 1,
      },
      productReadings: {
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
    },
    orderBy: { name: 'asc' },
  });

  const disposalsData = await Promise.all(
    products.map(async (product) => {
      const beforeReading = product.productReadings[0]?.reading ?? new Decimal(0);

      let priceSnapshot = product.productPrices[0]?.price ?? new Decimal(0);

      if (!product.productPrices[0]) {
        const latestPrice = await prisma.productPrice.findFirst({
          where: { productId: product.id },
          orderBy: { effectiveFrom: 'desc' },
        });
        priceSnapshot = latestPrice?.price ?? new Decimal(0);
      }

      const afterReading = beforeReading;
      const netDisposal = new Decimal(0);
      const totalSales = new Decimal(0);

      return {
        productId: product.id,
        beforeReading,
        afterReading,
        netDisposal,
        priceSnapshot,
        totalSales,
      };
    }),
  );

  const report = await prisma.report.create({
    data: {
      tenantId,
      creatorId,
      shiftId,
      shiftDate,
      periodStart,
      periodEnd,
      status: ReportStatus.DRAFT,
      disposals: {
        create: disposalsData,
      },
    },
    include: {
      shift: true,
      creator: { select: { id: true, name: true } },
      income: true,
      expenses: true,
      disposals: { include: { product: true } },
      inventories: { include: { product: true } },
      employees: {
        include: {
          user: {
            select: { id: true, name: true, username: true },
          },
        },
      },
    },
  });

  return {
    ...report,
    ...computeReportTotals(report),
  };
};

const getReports = async ({
  tenantId,
  status,
  shiftDate,
  startDate,
  endDate,
  creatorId,
  page,
  pageSize,
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

  const include = {
    creator: { select: { id: true, name: true } },
    shift: true,
    income: { select: { amount: true } },
    expenses: { select: { amount: true } },
    inventories: { include: { product: true } },
    disposals: {
      include: { product: true },
      orderBy: {
        product: {
          name: 'asc',
        },
      },
    },
    employees: {
      include: {
        user: {
          select: { id: true, name: true, username: true },
        },
      },
    },
    _count: {
      select: { expenses: true },
    },
  } as const;

  const [reports, total] = await Promise.all([
    prisma.report.findMany({
      where,
      include,
      orderBy: { submittedAt: 'desc' },
      ...getPaginationArgs({ page, pageSize }),
    }),
    prisma.report.count({ where }),
  ]);

  return {
    reports: reports.map((report) => ({ ...report, ...computeReportTotals(report) })),
    total,
  };
};

const getReportById = async (reportId: string) => {
  const report = await prisma.report.findUnique({
    where: { id: reportId },
    include: {
      creator: { select: { id: true, name: true } },
      shift: true,
      income: true,
      expenses: true,
      disposals: {
        include: { product: true },
        orderBy: {
          product: {
            name: 'asc',
          },
        },
      },
      inventories: { include: { product: true } },
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

  return {
    ...report,
    ...computeReportTotals(report),
  };
};

const getReportByShift = async ({
  tenantId,
  shiftId,
  shiftDate,
}: {
  tenantId: string;
  shiftId: string;
  shiftDate: Date;
}) => {
  const report = await prisma.report.findFirst({
    where: {
      tenantId,
      shiftDate,
      shiftId,
    },
    include: {
      creator: { select: { id: true, name: true } },
      shift: true,
      income: true,
      expenses: true,
      disposals: { include: { product: true } },
      inventories: { include: { product: true } },
      employees: {
        include: {
          user: {
            select: { id: true, name: true, username: true },
          },
        },
      },
    },
  });

  if (!report) throw new NotFoundError('Report not found');

  return {
    ...report,
    ...computeReportTotals(report),
  };
};

const validateReport = async (reportId: string, userId: string, userRole: Role) => {
  const report = await getReportById(reportId);

  if (report.creatorId !== userId && userRole !== Role.ADMIN) {
    throw new ForbiddenError('Only creator or admin can validate report');
  }

  if (report.status !== ReportStatus.DRAFT) {
    throw new ConflictError('Only draft reports can be validated');
  }

  const updatedReport = await prisma.report.update({
    where: { id: reportId },
    data: { status: ReportStatus.VALIDATED },
    include: {
      creator: { select: { id: true, name: true } },
      shift: true,
      income: true,
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

  return {
    ...updatedReport,
    ...computeReportTotals(updatedReport),
  };
};

const submitReport = async (
  reportId: string,
  userId: string,
  userRole: Role,
  remarks?: string | null,
) => {
  const report = await getReportById(reportId);

  if (report.creatorId !== userId && userRole !== Role.ADMIN) {
    throw new ForbiddenError('Only creator or admin can submit report');
  }

  if (report.status !== ReportStatus.VALIDATED) {
    throw new ConflictError('Only validated reports can be submitted');
  }

  return await prisma.$transaction(async (tx) => {
    await aggregateReportIncome(reportId, tx);
    await aggregateReportExpense(reportId, tx);
    await aggregateReportDisposal(reportId, tx);
    await aggregateReportInventorySales(reportId, tx);

    // Get disposals to extract afterReading values
    const disposals = await tx.reportDisposal.findMany({
      where: { reportId },
      select: { productId: true, afterReading: true },
    });

    // Process inventory deductions BEFORE updating status
    await processInventoryDeductions(reportId);

    // Create ProductReading records for each disposal's afterReading
    await Promise.all(
      disposals.map((disposal) =>
        tx.productReading.create({
          data: {
            productId: disposal.productId,
            reading: disposal.afterReading,
          },
        }),
      ),
    );

    const updatedReport = await tx.report.update({
      where: { id: reportId },
      data: {
        status: ReportStatus.SUBMITTED,
        submittedAt: new Date(),
        remarks,
      },
      include: {
        creator: { select: { id: true, name: true } },
        shift: true,
        income: true,
        expenses: true,
        disposals: { include: { product: true } },
        inventories: { include: { product: true } },
        employees: {
          include: {
            user: {
              select: { id: true, name: true, username: true },
            },
          },
        },
      },
    });

    return {
      ...updatedReport,
      ...computeReportTotals(updatedReport),
    };
  });
};

const deleteReport = async (reportId: string, userRole: Role): Promise<void> => {
  const report = await prisma.report.findUnique({
    where: { id: reportId },
    select: { status: true, shift: { select: { name: true } } },
  });

  if (!report) {
    throw new NotFoundError('Report not found');
  }

  if (userRole !== Role.ADMIN && report.status !== ReportStatus.DRAFT) {
    throw new ConflictError(
      'Only DRAFT reports can be deleted. VALIDATED and SUBMITTED reports are permanent records.',
    );
  }

  if (report.status === ReportStatus.SUBMITTED) {
    await prisma.$transaction(async (tx) => {
      await deaggregateReportIncome(reportId, tx);
      await deaggregateReportExpense(reportId, tx);
      await deaggregateReportDisposal(reportId, tx);
      await deaggregateReportInventorySales(reportId, tx);
      await tx.report.delete({ where: { id: reportId } });
    });
  } else {
    await prisma.report.delete({ where: { id: reportId } });
  }
};

const updateRemarks = async (reportId: string, userId: string, remarks: string | null) => {
  const report = await prisma.report.findUnique({
    where: { id: reportId },
    select: { creatorId: true, status: true },
  });

  if (!report) throw new NotFoundError('Report not found');
  if (report.creatorId !== userId) throw new ForbiddenError('Only creator can update remarks');
  if (report.status === ReportStatus.SUBMITTED)
    throw new ConflictError('Cannot edit a submitted report');

  return prisma.report.update({
    where: { id: reportId },
    data: { remarks },
    select: { id: true, remarks: true },
  });
};

export {
  createReport,
  getReports,
  getReportById,
  getReportByShift,
  validateReport,
  submitReport,
  updateRemarks,
  deleteReport,
};
