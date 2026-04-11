import { prisma } from '~/db';
import { Prisma, Role, TimesheetEntryAction } from '~/db/prisma';
import { ConflictError, ForbiddenError, NotFoundError } from '~/errors';
import { applyTimeToDate, getEndOfDay, getStartOfDay } from '~/utils';

import { CreateTimesheetPayload } from '../schema/createTimesheetSchema';
import { UpdateTimesheetInput } from '../schema/updateTimesheetSchema';
import { calculateHoursBetween, calculateShiftBasedHours } from '../utils/shift-calculator';

const DEFAULT_WORK_HOURS_CAP = 8;

const createTimesheet = async ({ userId, tenantId }: CreateTimesheetPayload) => {
  const startOfToday = getStartOfDay();
  const endOfToday = getEndOfDay();

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
  const startOfDay = getStartOfDay();
  const endOfDay = getEndOfDay();

  const timesheet = prisma.timesheet.findFirst({
    where: {
      userId,
      createdAt: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
    orderBy: { createdAt: 'desc' },
    include: {
      entries: {
        orderBy: { timestamp: 'desc' },
      },
    },
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
  processed,
}: {
  userId?: string;
  startDate?: string;
  endDate?: string;
  username?: string;
  tenantId?: string;
  processed?: boolean;
}) => {
  const where: Prisma.TimesheetWhereInput = {
    userId,
    tenantId,
    processed,
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
          salaryRates: {
            where: {
              tenantId,
            },
            orderBy: {
              effectiveFrom: 'desc',
            },
            take: 1,
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return timesheets;
};

const getLatestTimesheets = (tenantId: string) => {
  const startOfDay = getStartOfDay();
  const endOfDay = getEndOfDay();

  return prisma.timesheet.findMany({
    where: {
      tenantId,
      createdAt: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      id: true,
      userId: true,
      user: {
        select: {
          name: true,
        },
      },
      entries: {
        select: {
          timestamp: true,
          action: true,
        },
      },
      totalHours: true,
      createdAt: true,
    },
  });
};

const getDailyTimesheets = async (tenantId: string) => {
  const startOfDay = getStartOfDay();
  const endOfDay = getEndOfDay();
  const now = new Date();

  const tenantWithUsers = await prisma.tenant.findUnique({
    where: { id: tenantId },
    select: {
      users: {
        where: {
          user: {
            role: Role.USER,
          },
        },
        select: {
          userId: true,
          shift: {
            select: { shiftStart: true },
          },
          user: {
            select: { id: true, name: true, email: true, role: true },
          },
        },
      },
    },
  });

  if (!tenantWithUsers) {
    throw new NotFoundError('Tenant not found');
  }

  const todayTimesheets = await prisma.timesheet.findMany({
    where: {
      tenantId,
      createdAt: { gte: startOfDay, lte: endOfDay },
    },
    select: {
      userId: true,
      entries: {
        where: { timestamp: { gte: startOfDay, lte: endOfDay } },
        orderBy: { timestamp: 'asc' },
        select: { action: true, timestamp: true },
      },
    },
  });

  const timesheetMap = new Map(todayTimesheets.map((ts) => [ts.userId, ts.entries]));

  const usersWithTimesheet = tenantWithUsers.users.map(({ user, shift }) => {
    const entries = timesheetMap.get(user.id) || [];

    const checkInEntry = entries.find((e) => e.action === TimesheetEntryAction.CHECK_IN);
    const checkOutEntries = entries.filter((e) => e.action === TimesheetEntryAction.CHECK_OUT);
    const checkOutEntry = checkOutEntries[checkOutEntries.length - 1];
    const latestEntry = entries[entries.length - 1];

    const status: 'IN' | 'OUT' =
      latestEntry?.action === TimesheetEntryAction.CHECK_IN ? 'IN' : 'OUT';
    const checkIn = checkInEntry?.timestamp || null;
    const checkOut = checkOutEntry?.timestamp || null;

    let notes = null;

    if (shift?.shiftStart) {
      const expectedCheckIn = applyTimeToDate(shift.shiftStart, now);
      expectedCheckIn.setMinutes(expectedCheckIn.getMinutes() + 15);

      if (!checkIn && now > expectedCheckIn) {
        notes = 'Not checked in';
      }
    }

    return {
      ...user,
      status,
      checkIn: checkIn?.toISOString() || null,
      checkOut: checkOut?.toISOString() || null,
      notes,
      shiftStart: shift?.shiftStart?.toISOString() || null,
    };
  });

  return usersWithTimesheet.sort((a, b) => {
    if (a.status === 'IN' && b.status === 'OUT') return -1;
    if (a.status === 'OUT' && b.status === 'IN') return 1;
    return 0;
  });
};

const checkIn = async (userId: string) => {
  const startOfDay = getStartOfDay();
  const endOfDay = getEndOfDay();

  let timesheet = await prisma.timesheet.findFirst({
    where: {
      userId,
      createdAt: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
  });

  const userWithTenant = await prisma.user.findFirst({
    where: {
      id: userId,
    },
    include: {
      tenants: true,
    },
  });

  if (!userWithTenant || userWithTenant.tenants.length === 0) {
    throw new ForbiddenError('User has no tenant assigned');
  }

  const tenantId = userWithTenant.tenants[0].tenantId;

  let result;

  if (!timesheet) {
    result = await createTimesheet({ userId, tenantId });
  } else {
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

    result = await prisma.timesheetEntry.create({
      data: {
        timesheetId: timesheet.id,
        action: TimesheetEntryAction.CHECK_IN,
        timestamp: new Date(),
      },
    });
  }

  return result;
};

const checkOut = async (userId: string) => {
  const startOfDay = getStartOfDay();
  const endOfDay = getEndOfDay();

  const timesheet = await prisma.timesheet.findFirst({
    where: {
      userId,
      createdAt: { gte: startOfDay, lte: endOfDay },
    },
  });

  if (!timesheet) {
    throw new NotFoundError('No timesheet for today');
  }

  // Validate last entry was CHECK_IN
  const lastEntry = await prisma.timesheetEntry.findFirst({
    where: { timesheetId: timesheet.id },
    orderBy: { timestamp: 'desc' },
  });

  if (!lastEntry || lastEntry.action !== TimesheetEntryAction.CHECK_IN) {
    throw new NotFoundError('No active check-in entry for today');
  }

  const checkOutEntry = await prisma.timesheetEntry.create({
    data: {
      timesheetId: timesheet.id,
      action: TimesheetEntryAction.CHECK_OUT,
      timestamp: new Date(),
    },
  });

  const userWithShift = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      role: true,
      tenants: {
        where: { tenantId: timesheet.tenantId },
        select: {
          shift: {
            select: {
              shiftStart: true,
              shiftEnd: true,
            },
          },
        },
      },
    },
  });

  const hasShiftSchedule =
    userWithShift?.role === 'USER' &&
    userWithShift.tenants[0]?.shift?.shiftStart &&
    userWithShift.tenants[0]?.shift?.shiftEnd;

  let sessionHours: number;
  let hoursCap: number;

  if (hasShiftSchedule) {
    const result = calculateShiftBasedHours(
      {
        shiftStart: userWithShift.tenants[0].shift!.shiftStart,
        shiftEnd: userWithShift.tenants[0].shift!.shiftEnd,
      },
      {
        checkIn: lastEntry.timestamp,
        checkOut: checkOutEntry.timestamp,
      },
    );
    sessionHours = result.sessionHours;
    hoursCap = result.hoursCap;
  } else {
    sessionHours = calculateHoursBetween(lastEntry.timestamp, checkOutEntry.timestamp);
    hoursCap = DEFAULT_WORK_HOURS_CAP;
  }

  await prisma.timesheet.update({
    where: { id: timesheet.id },
    data: {
      totalHours: Math.min(timesheet.totalHours + sessionHours, hoursCap),
    },
  });

  return checkOutEntry;
};

const updateTimesheet = async ({ timesheetId, totalHours }: UpdateTimesheetInput) => {
  const timesheet = await prisma.timesheet.findUnique({
    where: {
      id: timesheetId,
    },
    select: {
      id: true,
      processed: true,
    },
  });

  if (!timesheet) {
    throw new NotFoundError('Timesheet not found');
  }

  if (timesheet.processed) {
    throw new ForbiddenError('Cannot update a processed timesheet');
  }

  const updatedTimesheet = await prisma.timesheet.update({
    where: {
      id: timesheetId,
    },
    data: {
      totalHours,
    },
  });

  return updatedTimesheet;
};

const deleteTimesheet = async (timesheetId: string, userId: string, userRole: string) => {
  const timesheet = await prisma.timesheet.findUnique({
    where: { id: timesheetId },
    select: { id: true, userId: true, processed: true },
  });

  if (!timesheet) {
    throw new NotFoundError('Timesheet not found');
  }

  // Admins can delete any, users only their own
  if (userRole !== 'ADMIN' && timesheet.userId !== userId) {
    throw new ForbiddenError('Not authorized to delete this timesheet');
  }

  if (timesheet.processed) {
    throw new ForbiddenError('Cannot delete a processed timesheet');
  }

  return prisma.timesheet.delete({ where: { id: timesheetId } });
};

export {
  createTimesheet,
  checkIn,
  checkOut,
  getTodayTimesheet,
  getTimesheet,
  getTimesheets,
  updateTimesheet,
  deleteTimesheet,
  getLatestTimesheets,
  getDailyTimesheets,
};
