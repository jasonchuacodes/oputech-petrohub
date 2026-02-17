import { NextFunction, Response } from 'express';

import { AuthenticatedRequest } from '~/middlewares';
import { createSchemaValidator } from '~/utils';

import * as timesheetService from '../services/timesheet.service';
import { GetTimesheetSchema } from '../schema/getTimesheetSchema';
import { GetTimesheetsSchema } from '../schema/getTimesheetsSchema';
import { CreateTimesheetSchema } from '../schema/createTimesheetSchema';
import { UpdateTimesheetSchema } from '../schema/updateTimesheetSchema';
import { DeleteTimesheetSchema } from '../schema/deleteTimesheetSchema';
import { GetAttendanceSchema } from '../schema/getAttendanceSchema';

const validateGetTimesheet = createSchemaValidator(GetTimesheetSchema);
const validateGetTimesheets = createSchemaValidator(GetTimesheetsSchema);
const validateCreateTimesheet = createSchemaValidator(CreateTimesheetSchema);
const validateUpdateTimesheet = createSchemaValidator(UpdateTimesheetSchema);
const validateDeleteTimesheet = createSchemaValidator(DeleteTimesheetSchema);
const validateGetAttendance = createSchemaValidator(GetAttendanceSchema);

const createTimesheet = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { tenantId, userId } = await validateCreateTimesheet(req.body);

    const timesheet = await timesheetService.createTimesheet({
      userId,
      tenantId,
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
    const data = await timesheetService.checkIn(userId);

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
    await timesheetService.checkOut(userId);

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
    const timesheet = await timesheetService.getTodayTimesheet(userId);

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
    const timesheet = await timesheetService.getTimesheet(userId, timesheetId);

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
    const filters = await validateGetTimesheets({
      tenantId: req.query.tenantId as string,
      userId: req.query.userId as string,
      startDate: req.query.startDate as string,
      endDate: req.query.endDate as string,
    });

    const timesheets = await timesheetService.getTimesheets(filters);

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
      tenantId: req.query.tenantId as string,
      startDate: req.query.startDate as string,
      endDate: req.query.endDate as string,
      processed: req.query.processed === 'true' ? true : req.query.processed === 'false' ? false : undefined,
    });

    const timesheets = await timesheetService.getTimesheets(filters);

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

const getDailyTimesheets = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { tenantId } = await validateGetAttendance({
      tenantId: req.query.tenantId as string,
    });

    const users = await timesheetService.getDailyTimesheets(tenantId);

    res.status(200).json({
      message: 'Successfully retrieved daily timesheets',
      data: {
        users,
      },
    });
  } catch (err) {
    next(err);
  }
};

const updateTimesheet = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { timesheetId, totalHours } = await validateUpdateTimesheet(req.body);

    const timesheets = await timesheetService.updateTimesheet({
      timesheetId,
      totalHours: Number(totalHours),
    });

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

const deleteTimesheet = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { timesheetId } = await validateDeleteTimesheet({
      timesheetId: req.params.timesheetId,
    });

    const userId = req.user!.id;
    const userRole = req.user!.role;

    await timesheetService.deleteTimesheet(timesheetId, userId, userRole);

    res.status(204).json({
      message: 'Timesheet deleted successfully',
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
  updateTimesheet,
  deleteTimesheet,
  getDailyTimesheets,
};
