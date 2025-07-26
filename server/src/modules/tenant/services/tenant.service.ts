import { prisma } from '~/db/index';
import { NotFoundError } from '~/errors';

import { CreateTenantPayload } from '../schema/createTenantSchema';

const createTenant = async (data: CreateTenantPayload) => {
  const tenant = await prisma.tenant.create({
    data,
  });

  return tenant;
};

const getTenants = async () => {
  const tenants = await prisma.tenant.findMany();

  return tenants;
};

const getTenantUsers = async (tenantId: number) => {
  const users = await prisma.user.findMany({
    where: { tenantId },
  });

  if (users.length === 0) {
    throw new NotFoundError('No users found');
  }

  return users;
};

export { createTenant, getTenants, getTenantUsers };
