import { prisma } from '~/db/index';

import { CreateTenantPayload } from '../schema/createTenantSchema';

const createTenant = async (data: CreateTenantPayload) => {
  const tenant = await prisma.tenant.create({
    data,
  });

  return tenant;
};

export { createTenant };
