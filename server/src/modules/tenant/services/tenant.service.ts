import { prisma } from '~/db/index';
import { NotFoundError } from '~/errors';

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

const getTenants = async () => {
  const tenants = await prisma.tenant.findMany();

  return tenants;
};

const getTenantUsers = async (tenantId: number) => {
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

  if (!tenantWithUsers || tenantWithUsers.users.length === 0) {
    throw new NotFoundError('No users found');
  }

  const users = tenantWithUsers.users.map((u) => u.user);

  return users;
};

export { createTenant, getTenants, getTenantUsers };
