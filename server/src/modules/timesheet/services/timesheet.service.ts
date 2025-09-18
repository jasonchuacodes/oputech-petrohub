import { prisma } from '~/db';
import { Prisma, TimesheetEntryAction, TimesheetStatus } from '~/db/prisma';
import { ConflictError, NotFoundError } from '~/errors';

import { CreateTimesheetPayload } from '../schema/createTimesheetSchema';

const createTimesheet = async ({ userId, tenantId }: CreateTimesheetPayload) => {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);

  const existingTimesheet = await prisma.timesheet.findFirst({
    where: {
      userId,
      createdAt: {
        gte: startOfToday,
        lte: endOfToday,
      },
    },
  });

  if (existingTimesheet) {
    throw new ConflictError('Timesheet for today already exists');
  }

  return prisma.timesheet.create({
    data: {
      user: { connect: { id: userId } },
      tenant: { connect: { id: tenantId } },
      entries: {
        create: {
          action: TimesheetEntryAction.CHECK_IN,
          timestamp: new Date(),
        },
      },
    },
    include: {
      entries: true,
    },
  });
};

const getTodayTimesheet = (userId: string) => {
  const startOfDay = new Date();
  startOfDay.setUTCHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setUTCHours(23, 59, 59, 999);

  const timesheet = prisma.timesheet.findFirst({
    where: {
      userId,
      createdAt: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
    orderBy: { createdAt: 'desc' },
    include: { entries: true },
  });

  if (!timesheet) {
    throw new NotFoundError('Timesheet not found');
  }

  return timesheet;
};

const getTimesheet = async (userId: string, timesheetId: string) => {
  const timesheet = await prisma.timesheet.findFirst({
    where: {
      id: timesheetId,
      userId,
    },
    include: {
      entries: true,
    },
  });

  if (!timesheet) {
    throw new Error('Timesheet not found');
  }

  return timesheet;
};

const getTimesheets = async ({
  userId,
  startDate,
  endDate,
  username,
  tenantId,
}: {
  userId?: string;
  startDate?: string;
  endDate?: string;
  username?: string;
  tenantId?: string;
}) => {
  const where: Prisma.TimesheetWhereInput = {
    userId,
    tenantId,
    user: username
      ? {
          name: {
            contains: username,
            mode: 'insensitive',
          },
        }
      : undefined,
    ...(startDate || endDate
      ? {
          createdAt: {
            ...(startDate ? { gte: new Date(startDate) } : {}),
            ...(endDate ? { lte: new Date(endDate) } : {}),
          },
        }
      : {}),
  };

  const timesheets = await prisma.timesheet.findMany({
    where,
    include: {
      entries: {
        orderBy: {
          timestamp: 'desc',
        },
      },
      user: {
        select: {
          id: true,
          name: true,
          role: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return timesheets;
};

export const checkIn = async ({ userId, tenantId }: { userId: string; tenantId: string }) => {
  const startOfDay = new Date();
  startOfDay.setUTCHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setUTCHours(23, 59, 59, 999);

  let timesheet = await prisma.timesheet.findFirst({
    where: {
      userId,
      createdAt: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
  });

  if (!timesheet) {
    return await createTimesheet({ userId, tenantId });
  }

  const latestEntry = await prisma.timesheetEntry.findFirst({
    where: {
      timesheetId: timesheet.id,
      timestamp: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
    orderBy: {
      timestamp: 'desc',
    },
  });

  if (latestEntry && latestEntry.action === TimesheetEntryAction.CHECK_IN) {
    throw new ConflictError('Already checked in today');
  }

  return prisma.timesheetEntry.create({
    data: {
      timesheetId: timesheet.id,
      action: TimesheetEntryAction.CHECK_IN,
      timestamp: new Date(),
    },
  });
};

export const checkOut = async ({ userId }: { userId: string }) => {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const timesheet = await prisma.timesheet.findFirst({
    where: {
      userId,
      createdAt: {
        gte: today,
      },
    },
  });

  if (!timesheet) {
    throw new Error('No timesheet for today');
  }

  const lastEntry = await prisma.timesheetEntry.findFirst({
    where: { timesheetId: timesheet.id },
    orderBy: { timestamp: 'desc' },
  });

  if (!lastEntry || lastEntry.action !== TimesheetEntryAction.CHECK_IN) {
    throw new Error('No active check-in entry for today');
  }

  const checkOutEntry = await prisma.timesheetEntry.create({
    data: {
      timesheetId: timesheet.id,
      action: TimesheetEntryAction.CHECK_OUT,
      timestamp: new Date(),
    },
  });

  const sessionHours = Number(
    (
      (checkOutEntry.timestamp.getTime() - lastEntry.timestamp.getTime()) /
      (1000 * 60 * 60)
    ).toFixed(2),
  );

  await prisma.timesheet.update({
    where: { id: timesheet.id },
    data: {
      totalHours: timesheet.totalHours + sessionHours,
      status: TimesheetStatus.PENDING,
    },
  });

  return checkOutEntry;
};

export { createTimesheet, getTodayTimesheet, getTimesheet, getTimesheets };
