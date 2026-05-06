import type { Response, NextFunction } from 'express';
import { getTotalIncomeAnalytics, getTotalExpenseAnalytics, getDisposalAnalyticsByType, getTotalInventorySalesAnalytics } from '../services/analytics.service';
import { getIncomeAnalyticsSchema } from '../schema/getIncomeAnalyticsSchema';
import { getExpenseAnalyticsSchema } from '../schema/getExpenseAnalyticsSchema';
import { getDisposalAnalyticsSchema } from '../schema/getDisposalAnalyticsSchema';
import { getInventorySalesAnalyticsSchema } from '../schema/getInventorySalesAnalyticsSchema';
import { rebuildAggregationsSchema } from '../schema/rebuildAggregationsSchema';
import { createSchemaValidator } from '~/utils/schema-validator';
import { rebuildAggregationsForTenant } from '../services/rebuild-aggregations.service';
import { Role } from '~/db/prisma';
import { UnauthorizedError } from '~/errors';
import { AuthenticatedRequest } from '~/middlewares';

const validateIncomeAnalytics = createSchemaValidator(getIncomeAnalyticsSchema);
const validateExpenseAnalytics = createSchemaValidator(getExpenseAnalyticsSchema);
const validateDisposalAnalytics = createSchemaValidator(getDisposalAnalyticsSchema);
const validateInventorySalesAnalytics = createSchemaValidator(getInventorySalesAnalyticsSchema);
const validateRebuildAggregations = createSchemaValidator(rebuildAggregationsSchema);

export const getIncomeAnalytics = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { tenantId, startDate, endDate } = await validateIncomeAnalytics(req.query);

    const data = await getTotalIncomeAnalytics({
      tenantId,
      startDate,
      endDate,
    });

    res.status(200).json({
      message: 'Income analytics retrieved successfully',
      data,
    });
  } catch (err) {
    next(err);
  }
};

export const getExpenseAnalytics = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { tenantId, startDate, endDate } = await validateExpenseAnalytics(req.query);

    const data = await getTotalExpenseAnalytics({
      tenantId,
      startDate,
      endDate,
    });

    res.status(200).json({
      message: 'Expense analytics retrieved successfully',
      data,
    });
  } catch (err) {
    next(err);
  }
};

export const getInventorySalesAnalytics = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { tenantId, startDate, endDate } = await validateInventorySalesAnalytics(req.query);

    const data = await getTotalInventorySalesAnalytics({
      tenantId,
      startDate,
      endDate,
    });

    res.status(200).json({
      message: 'Inventory analytics retrieved successfully',
      data,
    });
  } catch (err) {
    next(err);
  }
};

export const getDisposalAnalytics = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { tenantId, startDate, endDate } = await validateDisposalAnalytics(req.query);

    const data = await getDisposalAnalyticsByType({
      tenantId,
      startDate,
      endDate,
    });

    res.status(200).json({
      message: 'Disposal analytics retrieved successfully',
      data,
    });
  } catch (err) {
    next(err);
  }
};

export const rebuildAggregations = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (req.user!.role !== Role.ADMIN) {
      throw new UnauthorizedError('Only administrators can rebuild aggregations');
    }

    const { tenantId } = await validateRebuildAggregations(req.body);

    const result = await rebuildAggregationsForTenant(tenantId);

    res.status(200).json({
      message: result.status === 'skipped'
        ? 'Aggregations are already in sync. No rebuild needed.'
        : 'Aggregations rebuilt successfully.',
      data: result,
    });
  } catch (err) {
    next(err);
  }
};
