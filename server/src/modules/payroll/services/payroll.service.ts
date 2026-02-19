import { Decimal } from '@prisma/client/runtime/library';

import { prisma } from '~/db';
import { PaymentStatus, PayrollRunStatus, RateType } from '~/db/prisma';
import { NotFoundError } from '../../../errors';

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

const runPayroll = async (data: {
  tenantId: string;
  periodType: 'WEEKLY';
  periodStart: Date;
  periodEnd: Date;
  payslips: Array<{
    userId: string;
    timesheetIds: string[];
    totalHours: number;
    rateSnapshot: string;
    rateTypeSnapshot: RateType;
    totalCompensation: string;
    notes?: string;
  }>;
  notes?: string;
  createdBy: string;
}) => {
  return prisma.$transaction(async (tx) => {
    // Create the PayrollRun
    const payrollRun = await tx.payrollRun.create({
      data: {
        tenantId: data.tenantId,
        periodType: data.periodType,
        periodStart: data.periodStart,
        periodEnd: data.periodEnd,
        status: PayrollRunStatus.PENDING,
        createdBy: data.createdBy,
        notes: data.notes,
      },
    });

    // Create all payslips linked to this PayrollRun
    const payslips = await Promise.all(
      data.payslips.map(async (payslipData) => {
        const payslip = await tx.payslip.create({
          data: {
            tenantId: data.tenantId,
            userId: payslipData.userId,
            periodType: data.periodType,
            periodStart: data.periodStart,
            periodEnd: data.periodEnd,
            totalHours: payslipData.totalHours,
            rateSnapshot: new Decimal(payslipData.rateSnapshot),
            rateTypeSnapshot: payslipData.rateTypeSnapshot,
            totalCompensation: new Decimal(payslipData.totalCompensation),
            payrollRunId: payrollRun.id,
            notes: payslipData.notes,
            paymentStatus: PaymentStatus.UNPAID,
            createdBy: data.createdBy,
          },
        });

        // Create PayslipTimesheet join records
        await Promise.all(
          payslipData.timesheetIds.map(async (timesheetId) => {
            // Get the timesheet to calculate compensation snapshot
            const timesheet = await tx.timesheet.findUnique({
              where: { id: timesheetId },
            });

            if (timesheet) {
              // Calculate compensation for this specific timesheet
              const hoursSnapshot = timesheet.totalHours;
              const compensationSnapshot = new Decimal(payslipData.rateSnapshot).mul(hoursSnapshot);

              await tx.payslipTimesheet.create({
                data: {
                  payslipId: payslip.id,
                  timesheetId,
                  hoursSnapshot,
                  compensationSnapshot,
                },
              });
            }
          })
        );

        // Mark timesheets as processed
        await tx.timesheet.updateMany({
          where: {
            id: { in: payslipData.timesheetIds },
          },
          data: {
            processed: true,
          },
        });

        return payslip;
      })
    );

    // Return PayrollRun with payslips
    return tx.payrollRun.findUnique({
      where: { id: payrollRun.id },
      include: {
        payslips: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                username: true,
              },
            },
          },
        },
      },
    });
  });
};

const getPayrollRuns = async (data: {
  tenantId: string;
  periodStart?: Date;
  periodEnd?: Date;
}) => {
  return prisma.payrollRun.findMany({
    where: {
      tenantId: data.tenantId,
      ...(data.periodStart && {
        periodStart: { gte: data.periodStart },
      }),
      ...(data.periodEnd && {
        periodEnd: { lte: data.periodEnd },
      }),
    },
    include: {
      payslips: {
        select: {
          id: true,
          totalCompensation: true,
          paymentStatus: true,
        },
      },
      createdByUser: {
        select: {
          id: true,
          name: true,
          username: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
};

const getPayrollRunById = async (payrollRunId: string) => {
  return prisma.payrollRun.findUnique({
    where: { id: payrollRunId },
    include: {
      payslips: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              username: true,
            },
          },
        },
      },
      createdByUser: {
        select: {
          id: true,
          name: true,
          username: true,
        },
      },
    },
  });
};

const markPayslipAsPaid = async (data: {
  payslipId: string;
  paidAt?: Date;
  paymentMethod?: string;
  paymentNotes?: string;
}) => {
  return prisma.$transaction(async (tx) => {
    const payslip = await tx.payslip.update({
      where: { id: data.payslipId },
      data: {
        paymentStatus: PaymentStatus.PAID,
        paidAt: data.paidAt || new Date(),
        paymentMethod: data.paymentMethod,
        paymentNotes: data.paymentNotes,
      },
    });

    // If this payslip is part of a PayrollRun, check if all payslips are now paid
    if (payslip.payrollRunId) {
      const allPayslips = await tx.payslip.findMany({
        where: { payrollRunId: payslip.payrollRunId },
        select: { paymentStatus: true },
      });

      const allPaid = allPayslips.every((p) => p.paymentStatus === PaymentStatus.PAID);

      if (allPaid && allPayslips.length > 0) {
        await tx.payrollRun.update({
          where: { id: payslip.payrollRunId },
          data: { status: PayrollRunStatus.PAID },
        });
      }
    }

    return payslip;
  });
};

const cancelPayrollRun = async (payrollRunId: string) => {
  return prisma.$transaction(async (tx) => {
    const payrollRun = await tx.payrollRun.findUnique({
      where: { id: payrollRunId },
      include: {
        payslips: {
          include: {
            timesheets: {
              select: { timesheetId: true },
            },
          },
        },
      },
    });

    if (!payrollRun) {
      throw new NotFoundError(`PayrollRun with id ${payrollRunId} not found`);
    }

    const timesheetIds = payrollRun.payslips
      .filter((payslip) => payslip.paymentStatus !== PaymentStatus.PAID)
      .flatMap((payslip) => payslip.timesheets.map((pt) => pt.timesheetId));

    const uniqueTimesheetIds = [...new Set(timesheetIds)];

    if (uniqueTimesheetIds.length > 0) {
      await tx.timesheet.updateMany({
        where: {
          id: { in: uniqueTimesheetIds },
        },
        data: {
          processed: false,
        },
      });
    }

    return tx.payrollRun.update({
      where: { id: payrollRunId },
      data: {
        status: PayrollRunStatus.CANCELLED,
      },
    });
  });
};

const generatePayslip = async (data: {
  tenantId: string;
  userId: string;
  timesheetIds: string[];
  periodType: 'WEEKLY';
  periodStart: Date;
  periodEnd: Date;
  totalHours: number;
  rateSnapshot: string;
  rateTypeSnapshot: RateType;
  totalCompensation: string;
  payrollRunId?: string;
  notes?: string;
  createdBy: string;
}) => {
  return prisma.$transaction(async (tx) => {
    // Create the payslip
    const payslip = await tx.payslip.create({
      data: {
        tenantId: data.tenantId,
        userId: data.userId,
        periodType: data.periodType,
        periodStart: data.periodStart,
        periodEnd: data.periodEnd,
        totalHours: data.totalHours,
        rateSnapshot: new Decimal(data.rateSnapshot),
        rateTypeSnapshot: data.rateTypeSnapshot,
        totalCompensation: new Decimal(data.totalCompensation),
        payrollRunId: data.payrollRunId,
        notes: data.notes,
        paymentStatus: PaymentStatus.UNPAID,
        createdBy: data.createdBy,
      },
    });

    // Create PayslipTimesheet join records
    await Promise.all(
      data.timesheetIds.map(async (timesheetId) => {
        const timesheet = await tx.timesheet.findUnique({
          where: { id: timesheetId },
        });

        if (timesheet) {
          const hoursSnapshot = timesheet.totalHours;
          const compensationSnapshot = new Decimal(data.rateSnapshot).mul(hoursSnapshot);

          await tx.payslipTimesheet.create({
            data: {
              payslipId: payslip.id,
              timesheetId,
              hoursSnapshot,
              compensationSnapshot,
            },
          });
        }
      })
    );

    // Mark timesheets as processed
    await tx.timesheet.updateMany({
      where: {
        id: { in: data.timesheetIds },
      },
      data: {
        processed: true,
      },
    });

    return payslip;
  });
};

const getPayslips = async (data: {
  tenantId: string;
  userId?: string;
  periodStart?: Date;
  periodEnd?: Date;
}) => {
  return prisma.payslip.findMany({
    where: {
      tenantId: data.tenantId,
      ...(data.userId && { userId: data.userId }),
      ...(data.periodStart && {
        periodStart: { gte: data.periodStart },
      }),
      ...(data.periodEnd && {
        periodEnd: { lte: data.periodEnd },
      }),
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
    orderBy: { createdAt: 'desc' },
  });
};

export {
  getUnprocessedTimesheets,
  runPayroll,
  getPayrollRuns,
  getPayrollRunById,
  markPayslipAsPaid,
  cancelPayrollRun,
  generatePayslip,
  getPayslips,
};
