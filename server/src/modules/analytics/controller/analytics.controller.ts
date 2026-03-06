import { Request, Response, NextFunction } from 'express';
import { getTotalIncomeAnalytics, getTotalExpenseAnalytics, getDisposalAnalyticsByType, getTotalInventorySalesAnalytics } from '../services/analytics.service';
import { getIncomeAnalyticsSchema } from '../schema/getIncomeAnalyticsSchema';
import { getExpenseAnalyticsSchema } from '../schema/getExpenseAnalyticsSchema';
import { getDisposalAnalyticsSchema } from '../schema/getDisposalAnalyticsSchema';
import { getInventorySalesAnalyticsSchema } from '../schema/getInventorySalesAnalyticsSchema';
import { createSchemaValidator } from '~/utils/schema-validator';

const validateIncomeAnalytics = createSchemaValidator(getIncomeAnalyticsSchema);
const validateExpenseAnalytics = createSchemaValidator(getExpenseAnalyticsSchema);
const validateDisposalAnalytics = createSchemaValidator(getDisposalAnalyticsSchema);
const validateInventorySalesAnalytics = createSchemaValidator(getInventorySalesAnalyticsSchema);

export const getIncomeAnalytics = async (req: Request, res: Response, next: NextFunction) => {
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

export const getExpenseAnalytics = async (req: Request, res: Response, next: NextFunction) => {
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

export const getInventorySalesAnalytics = async (req: Request, res: Response, next: NextFunction) => {
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

export const getDisposalAnalytics = async (req: Request, res: Response, next: NextFunction) => {
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
