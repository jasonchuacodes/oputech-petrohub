import { NextFunction, Request, Response } from 'express';

import { Role } from '~/db/prisma';
import { NotFoundError, UnauthorizedError } from '~/errors';
import { AuthenticatedRequest } from '~/middlewares';
import { createSchemaValidator } from '~/utils';

import * as tenantService from '../services/tenant.service';
import { CreateTenantSchema } from '../schema/createTenantSchema';
import { GetTenantUsersSchema } from '../schema/getTenantUsersSchema';
import { GetTenantByIdSchema } from '../schema/getTenantByIdSchema';
import { UpdateTenantSchema } from '../schema/updateTenantSchema';

const validateCreateTenant = createSchemaValidator(CreateTenantSchema);
const validateUpdateTenant = createSchemaValidator(UpdateTenantSchema);
const validateGetTenantUsers = createSchemaValidator(GetTenantUsersSchema);
const validateGetTenantById = createSchemaValidator(GetTenantByIdSchema);

const createTenant = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id as string;

    const data = await validateCreateTenant(req.body);

    const tenant = await tenantService.createTenant({
      createdById: userId,
      ...data,
    });

    res.status(200).json({
      message: 'Tenant created successfully',
      data: {
        tenant,
      },
    });
  } catch (err) {
    next(err);
  }
};

const updateTenant = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { role } = req.user!;

    const data = await validateUpdateTenant(req.body);

    if (role !== Role.ADMIN) {
      throw new UnauthorizedError(
        'Unauthorized. You do not have permissions to update the tenant information.',
      );
    }

    const tenant = await tenantService.updateTenant(data);

    res.status(200).json({
      message: 'Tenant updated successfully',
      data: { tenant },
    });
  } catch (err) {
    next(err);
  }
};

const getTenantById = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;

    const { tenantId } = await validateGetTenantById({
      tenantId: req.params.tenantId,
    });

    const tenant = await tenantService.getTenantById(userId, tenantId);

    res.status(200).json({
      message: 'Successfully retrieved tenant',
      data: {
        tenant,
      },
    });
  } catch (err) {
    next(err);
  }
};

const getTenants = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const tenants = await tenantService.getTenants(userId);

    if (tenants.length === 0) {
      throw new NotFoundError('No tenants found');
    }

    res.status(200).json({
      message: 'Successfully retrieved tenants',
      data: {
        tenants,
      },
    });
  } catch (err) {
    next(err);
  }
};

const getTenantUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { tenantId } = await validateGetTenantUsers({ tenantId: req.params.tenantId });

    const users = await tenantService.getTenantUsers(tenantId);

    res.status(200).json({
      message: 'Successfully retrieved tenant users',
      data: {
        users,
      },
    });
  } catch (err) {
    next(err);
  }
};

export { createTenant, updateTenant, getTenantById, getTenantUsers, getTenants };
