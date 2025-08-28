import { NextFunction, Response } from 'express';

import { AuthenticatedRequest } from '~/middlewares';

import { createTimesheet as createTimesheetService } from '../services/timesheet.service';

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

export { createTimesheet };
