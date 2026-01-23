import { prisma } from '~/db';
import { ConflictError, NotFoundError } from '~/errors';
import type { CreateShiftPayload } from '../schema/createShiftSchema';
import type { UpdateShiftPayload } from '../schema/updateShiftSchema';
import { getNextShiftColor } from '../utils/shiftColors';

const createShift = async (data: CreateShiftPayload) => {
  const existing = await prisma.shift.findFirst({
    where: { tenantId: data.tenantId, name: data.name },
  });

  if (existing) {
    throw new ConflictError('Shift with this name already exists');
  }

  const count = await prisma.shift.count({ where: { tenantId: data.tenantId } });

  return await prisma.shift.create({
    data: {
      tenantId: data.tenantId,
      name: data.name,
      shiftStart: new Date(data.shiftStart),
      shiftEnd: new Date(data.shiftEnd),
      color: getNextShiftColor(count),
    },
  });
};

const getShiftsByTenantId = async (tenantId: string) => {
  return await prisma.shift.findMany({
    where: { tenantId },
    include: {
      _count: {
        select: { users: true },
      },
    },
    orderBy: {
      shiftStart: 'asc',
    },
  });
};

const getShiftById = async (shiftId: string, tenantId: string) => {
  const shift = await prisma.shift.findFirst({
    where: { id: shiftId, tenantId },
    include: {
      users: {
        include: {
          user: {
            select: { id: true, name: true, email: true },
          },
        },
      },
    },
  });

  if (!shift) {
    throw new NotFoundError('Shift not found');
  }

  return shift;
};

const updateShift = async (
  shiftId: string,
  tenantId: string,
  data: UpdateShiftPayload,
) => {
  const shift = await prisma.shift.findFirst({
    where: { id: shiftId, tenantId },
  });

  if (!shift) {
    throw new NotFoundError('Shift not found');
  }

  if (data.name && data.name !== shift.name) {
    const existing = await prisma.shift.findFirst({
      where: { tenantId, name: data.name, id: { not: shiftId } },
    });

    if (existing) {
      throw new ConflictError('Shift with this name already exists');
    }
  }

  return await prisma.shift.update({
    where: { id: shiftId },
    data: {
      name: data.name,
      shiftStart: data.shiftStart ? new Date(data.shiftStart) : undefined,
      shiftEnd: data.shiftEnd ? new Date(data.shiftEnd) : undefined,
    },
  });
};

const deleteShift = async (shiftId: string, tenantId: string) => {
  const shift = await prisma.shift.findFirst({
    where: { id: shiftId, tenantId },
  });

  if (!shift) {
    throw new NotFoundError('Shift not found');
  }

  return await prisma.shift.delete({
    where: { id: shiftId },
  });
};

export { createShift, getShiftsByTenantId, getShiftById, updateShift, deleteShift };
