import { NextFunction, Response } from 'express';

import { NotFoundError } from '~/errors';
import { AuthenticatedRequest } from '~/middlewares';
import { createSchemaValidator } from '~/utils';

import {
  createTimesheet as createTimesheetService,
  getTodayTimesheet as getTodayTimesheetService,
  getTimesheet as getTimesheetService,
  getTimesheets as getTimesheetsService,
  checkIn as checkInService,
  checkOut as checkOutService,
} from '../services/timesheet.service';
import { GetTimesheetSchema } from '../schema/getTimesheetSchema';
import { GetTimesheetsSchema } from '../schema/getTimesheetsSchema';

const validateGetTimesheet = createSchemaValidator(GetTimesheetSchema);
const validateGetTimesheets = createSchemaValidator(GetTimesheetsSchema);

const createTimesheet = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;

    const timesheet = await createTimesheetService({
      userId,
    });

    res.status(200).json({
      message: 'Timesheet created successfully',
      data: {
        timesheet,
      },
    });
  } catch (err) {
    next(err);
  }
};

const checkIn = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const userId = req.user!.id;

  try {
    const data = await checkInService(userId);

    res.status(200).json({
      message: 'Checked in successfully',
      data,
    });
  } catch (err) {
    next(err);
  }
};

const checkOut = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const userId = req.user!.id;
  try {
    await checkOutService(userId);

    res.status(200).json({
      message: 'Checked out successfully',
    });
  } catch (err) {
    next(err);
  }
};

const getTodayTimesheet = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const userId = req.user!.id;

  try {
    const timesheet = await getTodayTimesheetService(userId);

    res.status(200).json({
      message: "Successfully retrieved today's timesheet",
      data: {
        timesheet,
      },
    });
  } catch (err) {
    next(err);
  }
};

const getTimesheetById = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const { timesheetId } = await validateGetTimesheet({
    timesheetId: req.params.timesheetId,
  });

  const userId = req.user!.id;

  try {
    const timesheet = await getTimesheetService(userId, timesheetId);

    res.status(200).json({
      message: 'Successfully retrieved timesheet',
      data: {
        timesheet,
      },
    });
  } catch (err) {
    next(err);
  }
};

const getUserTimesheets = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;

    const filters = await validateGetTimesheets({
      startDate: req.query.startDate as string,
      endDate: req.query.endDate as string,
    });

    const timesheets = await getTimesheetsService({ userId, ...filters });

    res.status(200).json({
      message: 'Successfully retrieved user timesheets',
      data: {
        timesheets,
      },
    });
  } catch (err) {
    next(err);
  }
};

const getAllTimesheets = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const filters = await validateGetTimesheets({
      startDate: req.query.startDate as string,
      endDate: req.query.endDate as string,
      username: req.query.username as string
    });

    const timesheets = await getTimesheetsService(filters);

    res.status(200).json({
      message: 'Successfully retrieved timesheets',
      data: {
        timesheets,
      },
    });
  } catch (err) {
    next(err);
  }
};

export {
  createTimesheet,
  checkIn,
  checkOut,
  getTodayTimesheet,
  getTimesheetById,
  getUserTimesheets,
  getAllTimesheets,
};
