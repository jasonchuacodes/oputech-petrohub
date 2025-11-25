import { prisma } from '~/db';
import { Prisma, TimesheetEntryAction, TimesheetStatus } from '~/db/prisma';
import { ConflictError, ForbiddenError, NotFoundError } from '~/errors';
import { getEndOfDay, getStartOfDay } from '~/utils';

import { CreateTimesheetPayload } from '../schema/createTimesheetSchema';
import { UpdateTimesheetInput } from '../schema/updateTimesheetSchema';
import { calculateHoursBetween, calculateShiftBasedHours } from '../utils/shift-calculator';

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

const getAttendance = async (tenantId: string) => {
  const startOfDay = getStartOfDay();
  const endOfDay = getEndOfDay();

  const tenantWithUsers = await prisma.tenant.findUnique({
    where: { id: tenantId },
    select: {
      users: {
        select: {
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
        orderBy: { timestamp: 'desc' },
        take: 1,
        select: { action: true },
      },
    },
  });

  const statusMap = new Map<string, 'IN' | 'OUT'>();
  todayTimesheets.forEach((ts) => {
    const latestEntry = ts.entries[0];
    statusMap.set(ts.userId, latestEntry?.action === 'CHECK_IN' ? 'IN' : 'OUT');
  });

  const usersWithStatus = tenantWithUsers.users.map(({ user }) => ({
    ...user,
    status: statusMap.get(user.id) || 'OUT',
  }));

  return usersWithStatus.sort((a, b) => {
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

const checkOut = async (userId: string) => {
  // Find today's timesheet
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

  // Create CHECK_OUT entry
  const checkOutEntry = await prisma.timesheetEntry.create({
    data: {
      timesheetId: timesheet.id,
      action: TimesheetEntryAction.CHECK_OUT,
      timestamp: new Date(),
    },
  });

  // Fetch user shift schedule
  const userWithShift = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      role: true,
      tenants: {
        where: { tenantId: timesheet.tenantId },
        select: {
          shiftStart: true,
          shiftEnd: true,
        },
      },
    },
  });

  // Calculate session hours and cap
  const hasShiftSchedule =
    userWithShift?.role === 'USER' &&
    userWithShift.tenants[0]?.shiftStart &&
    userWithShift.tenants[0]?.shiftEnd;

  let sessionHours: number;
  let hoursCap: number;

  if (hasShiftSchedule) {
    const result = calculateShiftBasedHours(
      {
        shiftStart: userWithShift.tenants[0].shiftStart!,
        shiftEnd: userWithShift.tenants[0].shiftEnd!,
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
    hoursCap = 8;
  }

  // Update timesheet with capped total hours
  await prisma.timesheet.update({
    where: { id: timesheet.id },
    data: {
      totalHours: Math.min(timesheet.totalHours + sessionHours, hoursCap),
      status: TimesheetStatus.PENDING,
    },
  });

  return checkOutEntry;
};

const updateTimesheet = async ({ timesheetId, totalHours }: UpdateTimesheetInput) => {
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

export {
  createTimesheet,
  checkIn,
  checkOut,
  getTodayTimesheet,
  getTimesheet,
  getTimesheets,
  updateTimesheet,
  getLatestTimesheets,
  getAttendance,
};
