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

export { createTenant, getTenants, getTenantUsers };
