import { NextFunction, Request, Response } from 'express';

import { AuthenticatedRequest } from '~/middlewares';
import { createSchemaValidator } from '~/utils';

import { createTenant as createTenantService } from '../services/tenant.service';
import { CreateTenantSchema } from '../schema/createTenantSchema';

const validateCreateTenant = createSchemaValidator(CreateTenantSchema);

const createTenant = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;

    const data = await validateCreateTenant(req.body);

    const tenant = await createTenantService({
      createdById: userId,
      ...data,
    });

    res.status(200).json({
      message: 'Tenant created successfully.',
      data: {
        tenant,
      },
    });
  } catch (err) {
    next(err);
  }
};

export { createTenant };
