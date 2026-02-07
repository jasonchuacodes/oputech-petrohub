import { prisma } from '~/db';
import { RateType } from '~/db/prisma';
import { ForbiddenError } from '~/errors';

const createSalaryRate = async (data: {
  userId: string;
  tenantId: string;
  rate: number;
  rateType: RateType;
  effectiveFrom?: Date;
}) => {
  // Verify user belongs to tenant
  const userInTenant = await prisma.tenantsOnUsers.findUnique({
    where: {
      userId_tenantId: { userId: data.userId, tenantId: data.tenantId },
    },
  });

  if (!userInTenant) {
    throw new ForbiddenError('User does not belong to this tenant');
  }

  return prisma.userSalaryRate.create({
    data: {
      userId: data.userId,
      tenantId: data.tenantId,
      rate: data.rate,
      rateType: data.rateType,
      effectiveFrom: data.effectiveFrom || new Date(),
    },
  });
};

const getCurrentSalaryRate = async (userId: string, tenantId: string) => {
  const now = new Date();

  return prisma.userSalaryRate.findFirst({
    where: {
      userId,
      tenantId,
      effectiveFrom: { lte: now },
    },
    orderBy: { effectiveFrom: 'desc' },
  });
};

const getSalaryRates = async (userId: string, tenantId: string) => {
  return prisma.userSalaryRate.findMany({
    where: {
      userId,
      tenantId,
    },
    orderBy: { effectiveFrom: 'desc' },
  });
};

const calculateCompensation = (
  totalHours: number,
  rate: number,
  rateType: RateType,
): number => {
  switch (rateType) {
    case RateType.HOURLY:
      return rate * totalHours;
    case RateType.DAILY:
      // Assume 8-hour work day
      return rate * (totalHours / 8);
    default:
      return 0;
  }
};

export { createSalaryRate, getCurrentSalaryRate, getSalaryRates, calculateCompensation };
