import { prisma } from '~/db';

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

export { getUnprocessedTimesheets };
