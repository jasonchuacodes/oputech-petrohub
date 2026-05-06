import { prisma } from '~/db/index';
import { Role } from '~/db/prisma';
import { ForbiddenError, NotFoundError } from '~/errors';

import { CreateTenantPayload } from '../schema/createTenantSchema';
import { UpdateTenantPayload } from '../schema/updateTenantSchema';

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

interface GetTenantUsersFilters {
  searchTerm?: string;
  role?: Role;
}

const getTenantUsers = async (tenantId: string, filters?: GetTenantUsersFilters) => {
  const tenantWithUsers = await prisma.tenant.findUnique({
    where: { id: tenantId },
    include: {
      users: {
        where: filters?.searchTerm || filters?.role
          ? {
              user: {
                ...(filters.searchTerm && {
                  name: { contains: filters.searchTerm, mode: 'insensitive' },
                }),
                ...(filters.role && { role: filters.role }),
              },
            }
          : undefined,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              username: true,
              role: true,
            },
          },
          shift: true,
        },
      },
    },
  });

  if (!tenantWithUsers) {
    throw new NotFoundError('Tenant not found');
  }

  return tenantWithUsers.users
    .map((u) => {
      let shiftSchedule = null;
      if (u.shift) {
        shiftSchedule = {
          shiftId: u.shift.id,
          shiftName: u.shift.name,
          shiftStart: u.shift.shiftStart,
          shiftEnd: u.shift.shiftEnd,
          color: u.shift.color,
        };
      }
      return { ...u.user, position: u.position, employeeId: u.employeeId, shiftSchedule };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
};

export { createTenant, updateTenant, getTenantById, getTenants, getTenantUsers };
