import { NextFunction, Request, Response } from 'express';

import { NotFoundError } from '~/errors';
import { AuthenticatedRequest } from '~/middlewares';
import { createSchemaValidator } from '~/utils';

import {
  createTenant as createTenantService,
  getTenants as getTenantsService,
  getTenantUsers as getTenantUsersService,
} from '../services/tenant.service';
import { CreateTenantSchema } from '../schema/createTenantSchema';
import { GetTenantUsersSchema } from '../schema/getTenantUsersSchema';

const validateCreateTenant = createSchemaValidator(CreateTenantSchema);
const validateGetTenantUsers = createSchemaValidator(GetTenantUsersSchema);

const createTenant = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;

    const data = await validateCreateTenant(req.body);

    const tenant = await createTenantService({
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

const getTenants = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const tenants = await getTenantsService();

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

const getTenantUsers = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { tenantId } = await validateGetTenantUsers({ tenantId: req.params.tenantId });

    const users = await getTenantUsersService(Number(tenantId));

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

export { createTenant, getTenantUsers, getTenants };
