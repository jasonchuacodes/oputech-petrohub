import { prisma } from '~/db';
import { TimesheetEntryAction } from '~/db/prisma';

import { CreateTimesheetPayload } from '../schema/createTimesheetSchema';

const createTimesheet = async (data: CreateTimesheetPayload) => {
  const { userId  } = data;

  const timesheet = await prisma.timesheet.create({
    data: {
      user: { connect: { id: userId } },
      entries: {
        create: {
          action: TimesheetEntryAction.CHECK_IN,
        },
      },
    },
  });

  return timesheet;
};

const getTimesheets = async (userId: string) => {};

export { createTimesheet, getTimesheets };
