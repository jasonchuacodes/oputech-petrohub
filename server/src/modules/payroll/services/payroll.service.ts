import { Decimal } from '@prisma/client/runtime/library';

import { prisma } from '~/db';
import { PayrollPeriodType } from '~/db/prisma';
import { BadRequestError, NotFoundError } from '~/errors';
import { calculateCompensation, getCurrentSalaryRate } from '~/modules/salary/services/salary.service';

const getUnprocessedTimesheets = async (data: {
  userId: string;
  tenantId: string;
  startDate: Date;
  endDate: Date;
}) => {
  return prisma.timesheet.findMany({
    where: {
      userId: data.userId,
      tenantId: data.tenantId,
      processed: false,
      createdAt: {
        gte: data.startDate,
        lte: data.endDate,
      },
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          username: true,
        },
      },
    },
    orderBy: { createdAt: 'asc' },
  });
};

const generatePayroll = async (data: {
  userId: string;
  tenantId: string;
  timesheetIds: string[];
  periodType: PayrollPeriodType;
  periodStart: Date;
  periodEnd: Date;
  createdBy: string;
}) => {
  // Validate timesheets are unprocessed
  const timesheets = await prisma.timesheet.findMany({
    where: {
      id: { in: data.timesheetIds },
      userId: data.userId,
      tenantId: data.tenantId,
      processed: false,
    },
  });

  if (timesheets.length !== data.timesheetIds.length) {
    throw new BadRequestError('Some timesheets are invalid or already processed');
  }

  // Get current salary rate
  const salaryRate = await getCurrentSalaryRate(data.userId, data.tenantId);

  if (!salaryRate) {
    throw new BadRequestError('No salary rate configured for this user');
  }

  // Calculate totals
  const totalHours = timesheets.reduce((sum, ts) => sum + ts.totalHours, 0);
  const totalCompensation = calculateCompensation(
    totalHours,
    Number(salaryRate.rate),
    salaryRate.rateType,
  );

  // Create payroll with transaction
  return prisma.$transaction(async (tx) => {
    // Create payroll record
    const payroll = await tx.payroll.create({
      data: {
        userId: data.userId,
        tenantId: data.tenantId,
        periodType: data.periodType,
        periodStart: data.periodStart,
        periodEnd: data.periodEnd,
        totalHours,
        rateSnapshot: salaryRate.rate,
        rateTypeSnapshot: salaryRate.rateType,
        totalCompensation,
        createdBy: data.createdBy,
      },
    });

    // Link timesheets to payroll
    await tx.payrollTimesheet.createMany({
      data: timesheets.map((ts) => ({
        payrollId: payroll.id,
        timesheetId: ts.id,
        hoursSnapshot: ts.totalHours,
        compensationSnapshot: new Decimal(
          calculateCompensation(ts.totalHours, Number(salaryRate.rate), salaryRate.rateType),
        ),
      })),
    });

    // Mark timesheets as processed
    await tx.timesheet.updateMany({
      where: {
        id: { in: data.timesheetIds },
      },
      data: {
        processed: true,
      },
    });

    return payroll;
  });
};

const getPayrollRecords = async (data: {
  tenantId: string;
  userId?: string;
  startDate?: Date;
  endDate?: Date;
}) => {
  return prisma.payroll.findMany({
    where: {
      tenantId: data.tenantId,
      userId: data.userId,
      periodStart: data.startDate ? { gte: data.startDate } : undefined,
      periodEnd: data.endDate ? { lte: data.endDate } : undefined,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          username: true,
          position: true,
        },
      },
      timesheets: {
        include: {
          timesheet: {
            select: {
              id: true,
              totalHours: true,
              createdAt: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
};

const getPayrollRecord = async (payrollId: string) => {
  const payroll = await prisma.payroll.findUnique({
    where: { id: payrollId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          username: true,
          position: true,
          email: true,
        },
      },
      tenant: {
        select: {
          id: true,
          name: true,
        },
      },
      timesheets: {
        include: {
          timesheet: {
            select: {
              id: true,
              totalHours: true,
              createdAt: true,
            },
          },
        },
      },
    },
  });

  if (!payroll) {
    throw new NotFoundError('Payroll record not found');
  }

  return payroll;
};

const deletePayroll = async (payrollId: string) => {
  // Get payroll with associated timesheet IDs
  const payroll = await prisma.payroll.findUnique({
    where: { id: payrollId },
    include: {
      timesheets: {
        select: {
          timesheetId: true,
        },
      },
    },
  });

  if (!payroll) {
    throw new NotFoundError('Payroll record not found');
  }

  const timesheetIds = payroll.timesheets.map((pt) => pt.timesheetId);

  // Delete payroll and unmark timesheets as processed
  return prisma.$transaction(async (tx) => {
    // Delete payroll (cascade deletes PayrollTimesheet records)
    await tx.payroll.delete({
      where: { id: payrollId },
    });

    // Unmark timesheets so they can be included in new payroll
    await tx.timesheet.updateMany({
      where: {
        id: { in: timesheetIds },
      },
      data: {
        processed: false,
      },
    });

    return { message: 'Payroll deleted successfully', timesheetsReleased: timesheetIds.length };
  });
};

export {
  getUnprocessedTimesheets,
  generatePayroll,
  getPayrollRecords,
  getPayrollRecord,
  deletePayroll,
};
