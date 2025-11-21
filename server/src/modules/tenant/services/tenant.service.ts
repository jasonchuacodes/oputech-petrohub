import { prisma } from '~/db/index';
import { ForbiddenError, NotFoundError } from '~/errors';

import { CreateTenantPayload } from '../schema/createTenantSchema';
import { UpdateTenantPayload } from '../schema/updateTenantSchema';
import { UserStatus } from '../types';

const createTenant = async (data: CreateTenantPayload) => {
  const { createdById, ...tenantData } = data;

  const tenant = await prisma.tenant.create({
    data: {
      ...tenantData,
      users: {
        create: {
          user: { connect: { id: createdById } },
        },
      },
    },
  });

  return tenant;
};

const updateTenant = async (data: UpdateTenantPayload) => {
  const { tenantId, ...updateData } = data;

  const tenant = await prisma.tenant.update({
    where: {
      id: tenantId,
    },
    data: {
      ...updateData,
    },
  });

  return tenant;
};

const getTenants = async (userId: string) => {
  const tenants = await prisma.tenant.findMany({
    where: {
      users: {
        some: {
          userId,
        },
      },
    },
  });

  return tenants;
};

const getTenantById = async (userId: string, tenantId: string) => {
  const tenant = await prisma.tenant.findUnique({
    where: {
      id: tenantId,
    },
    include: {
      users: true,
    },
  });

  if (!tenant || !tenant.users.some((u) => u.userId === userId)) {
    throw new ForbiddenError('You do not have access to this tenant');
  }

  return tenant;
};

const getTenantUsers = async (tenantId: string) => {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const tenantWithUsers = await prisma.tenant.findUnique({
    where: { id: tenantId },
    include: {
      users: {
        include: {
          user: {
            include: {
              timesheets: {
                where: { tenantId },
                include: {
                  entries: {
                    where: {
                      timestamp: { gte: startOfDay, lte: endOfDay },
                    },
                    orderBy: { timestamp: 'desc' },
                    take: 1,
                  },
                },
                take: 1,
              },
            },
          },
        },
      },
    },
  });

  if (!tenantWithUsers) {
    throw new NotFoundError('Tenant not found');
  }

  const usersWithStatus = tenantWithUsers.users.map((u) => {
    const { timesheets, ...user } = u.user;
    const latestEntry = timesheets[0]?.entries[0];
    const status = latestEntry?.action === 'CHECK_IN' ? UserStatus.IN : UserStatus.OUT;
    return { ...user, status };
  });

  // Sort: IN users first, then OUT users
  return usersWithStatus.sort((a, b) => {
    if (a.status === UserStatus.IN && b.status === UserStatus.OUT) return -1;
    if (a.status === UserStatus.OUT && b.status === UserStatus.IN) return 1;
    return 0;
  });
};

export { createTenant, updateTenant, getTenantById, getTenants, getTenantUsers };
