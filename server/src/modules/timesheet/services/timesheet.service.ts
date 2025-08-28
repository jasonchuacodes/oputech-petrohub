import { prisma } from '~/db';
import { Prisma, TimesheetEntryAction, TimesheetStatus } from '~/db/prisma';
import { ConflictError } from '~/errors';

import { CreateTimesheetPayload } from '../schema/createTimesheetSchema';

const createTimesheet = async ({ userId }: CreateTimesheetPayload) => {
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

const getTimesheets = async (userId: string, startDate?: string, endDate?: string) => {
  const where: Prisma.TimesheetWhereInput = {
    userId,
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
    include: { entries: true },
    orderBy: { createdAt: 'desc' },
  });

  return timesheets;
};

export const checkIn = async (userId: string) => {
  const startOfDay = new Date();
  startOfDay.setUTCHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setUTCHours(23, 59, 59, 999);

  const timesheet = await prisma.timesheet.findFirst({
    where: {
      userId,
      createdAt: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
  });

  if (timesheet) {
    const existingCheckIn = await prisma.timesheetEntry.findFirst({
      where: {
        timesheetId: timesheet.id,
        action: TimesheetEntryAction.CHECK_IN,
        timestamp: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
          lte: new Date(new Date().setHours(23, 59, 59, 999)),
        },
      },
    });

    if (existingCheckIn) {
      throw new ConflictError('Already checked in today');
    }

    return prisma.timesheetEntry.create({
      data: {
        timesheet: { connect: { id: timesheet.id } },
        action: TimesheetEntryAction.CHECK_IN,
        timestamp: new Date(),
      },
    });
  } else {
    return await createTimesheet({ userId });
  }
};

export const checkOut = async (userId: string) => {
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

  const checkInEntry = await prisma.timesheetEntry.findFirst({
    where: {
      timesheetId: timesheet.id,
      action: TimesheetEntryAction.CHECK_IN,
      timestamp: {
        gte: new Date(new Date().setHours(0, 0, 0, 0)),
        lte: new Date(new Date().setHours(23, 59, 59, 999)),
      },
    },
  });

  if (!checkInEntry) {
    throw new Error('No check-in entry for today');
  }

  const existingCheckOut = await prisma.timesheetEntry.findFirst({
    where: {
      timesheetId: timesheet.id,
      action: TimesheetEntryAction.CHECK_OUT,
      timestamp: {
        gte: new Date(new Date().setHours(0, 0, 0, 0)),
        lte: new Date(new Date().setHours(23, 59, 59, 999)),
      },
    },
  });

  if (existingCheckOut) {
    throw new ConflictError('Already checked out today');
  }

  const checkOutEntry = await prisma.timesheetEntry.create({
    data: {
      timesheet: { connect: { id: timesheet.id } },
      action: TimesheetEntryAction.CHECK_OUT,
      timestamp: new Date(),
    },
  });

  const totalHours = Number(
    (
      (checkOutEntry.timestamp.getTime() - checkInEntry.timestamp.getTime()) /
      (1000 * 60 * 60)
    ).toFixed(2),
  );

  await prisma.timesheet.update({
    where: { id: timesheet.id },
    data: {
      totalHours,
      status: TimesheetStatus.PENDING,
    },
  });

  return checkOutEntry;
};

export { createTimesheet, getTimesheet, getTimesheets };
