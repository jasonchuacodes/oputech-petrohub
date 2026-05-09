import { prisma } from '~/db/index';
import { ConflictError, NotFoundError, ForbiddenError } from '~/errors';
import { generateHash } from '~/utils';

import { CreateUserInput } from '../schema/createUserSchema';
import { UpdateUserPayload } from '../schema/updateUserSchema';

const createUser = async (data: CreateUserInput) => {
  const { tenantId, ...userData } = data;

  const existingUser = await prisma.user.findUnique({
    where: { username: userData.username },
  });

  if (existingUser) {
    throw new ConflictError('User with this username already exists');
  }

  return await prisma.user.create({
    data: {
      ...userData,
      tenants: {
        create: {
          tenant: {
            connect: { id: tenantId },
          },
        },
      },
    },
  });
};

const getAllUsers = () => prisma.user.findMany();

const getUsersByTenantId = (tenantId: string) =>
  prisma.user.findMany({
    where: {
      tenants: {
        some: { tenantId },
      },
    },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      tenants: {
        where: { tenantId },
        select: {
          position: true,
        },
      },
    },
  });

const getUserById = async (id: string, tenantId?: string) => {
  const user = await prisma.user.findFirst({
    where: { id },
    include: {
      tenants: {
        include: {
          tenant: true,
        },
      },
    },
  });

  if (!user) {
    throw new NotFoundError('User not found');
  }

  let shiftSchedule = null;
  let tenantUser: {
    shift: { id: string; name: string; shiftStart: Date; shiftEnd: Date } | null;
    employeeId: number;
    position: string | null;
    hireDate: Date | null;
    status: string;
  } | null = null;

  if (tenantId) {
    tenantUser = await prisma.tenantsOnUsers.findUnique({
      where: {
        userId_tenantId: {
          userId: id,
          tenantId,
        },
      },
      select: {
        shift: {
          select: {
            id: true,
            name: true,
            shiftStart: true,
            shiftEnd: true,
          },
        },
        employeeId: true,
        position: true,
        hireDate: true,
        status: true,
      },
    });

    if (tenantUser?.shift) {
      shiftSchedule = {
        shiftId: tenantUser.shift.id,
        shiftName: tenantUser.shift.name,
        shiftStart: tenantUser.shift.shiftStart,
        shiftEnd: tenantUser.shift.shiftEnd,
      };
    }
  }

  return {
    ...user,
    shiftSchedule,
    employeeId: tenantUser?.employeeId ?? null,
    position: tenantUser?.position ?? null,
    hireDate: tenantUser?.hireDate ?? null,
    status: tenantUser?.status ?? null,
  };
};

const updateUser = async (id: string, data: UpdateUserPayload, tenantId?: string) => {
  const existingUser = await prisma.user.findUnique({
    where: { id },
  });

  if (!existingUser) {
    throw new NotFoundError('User not found');
  }

  const { shiftId, position, hireDate, status, ...userData } = data as UpdateUserPayload & {
    shiftId?: string | null;
    position?: string | null;
    hireDate?: string | null;
    status?: string | null;
  };

  const updatedUser = await prisma.user.update({
    where: { id },
    data: userData,
  });

  if (tenantId) {
    const tenantData: Record<string, unknown> = {};
    if (shiftId !== undefined) tenantData.shiftId = shiftId || null;
    if (position !== undefined) tenantData.position = position || null;
    if (hireDate !== undefined) tenantData.hireDate = hireDate ? new Date(hireDate) : null;
    if (status !== undefined) tenantData.status = status || undefined;

    if (Object.keys(tenantData).length > 0) {
      await prisma.tenantsOnUsers.update({
        where: {
          userId_tenantId: {
            userId: id,
            tenantId,
          },
        },
        data: tenantData,
      });
    }
  }

  return updatedUser;
};

const deleteUser = async (id: string) => {
  const existingUser = await prisma.user.findUnique({
    where: { id },
  });

  if (!existingUser) {
    throw new NotFoundError('User not found');
  }

  await prisma.user.delete({
    where: { id },
  });
};

const resetUserPassword = async (userId: string, tenantId: string, newPassword: string) => {
  // Validate user exists and belongs to tenant
  const userInTenant = await prisma.tenantsOnUsers.findUnique({
    where: {
      userId_tenantId: {
        userId,
        tenantId,
      },
    },
  });

  if (!userInTenant) {
    throw new ForbiddenError('User does not belong to this tenant');
  }

  // Hash password and update
  const hashedPassword = await generateHash(newPassword);

  return await prisma.user.update({
    where: { id: userId },
    data: {
      password: hashedPassword,
      shouldChangePassword: true,
    },
  });
};

const getUserByUsername = async (username: string) => {
  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user) {
    throw new NotFoundError('User not found');
  }

  return user;
};

const updateLastTenant = async (userId: string, tenantId: string): Promise<void> => {
  const membership = await prisma.tenantsOnUsers.findUnique({
    where: { userId_tenantId: { userId, tenantId } },
    select: { userId: true },
  });

  if (!membership) {
    throw new ForbiddenError('User does not belong to this tenant');
  }

  await prisma.user.update({
    where: { id: userId },
    data: { lastTenantId: tenantId },
  });
};

export {
  createUser,
  getAllUsers,
  getUsersByTenantId,
  getUserById,
  updateUser,
  deleteUser,
  resetUserPassword,
  getUserByUsername,
  updateLastTenant,
};
