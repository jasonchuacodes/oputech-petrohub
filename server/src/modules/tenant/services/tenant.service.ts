import { prisma } from '~/db/index';
import { ForbiddenError, NotFoundError } from '~/errors';

import { CreateTenantPayload } from '../schema/createTenantSchema';

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
  const tenantWithUsers = await prisma.tenant.findUnique({
    where: { id: tenantId },
    include: {
      users: {
        include: {
          user: true,
        },
      },
    },
  });

  if (!tenantWithUsers) {
    throw new NotFoundError('Tenant not found');
  }

  return tenantWithUsers.users.map((u) => u.user) ?? [];
};

export { createTenant, getTenantById, getTenants, getTenantUsers };
