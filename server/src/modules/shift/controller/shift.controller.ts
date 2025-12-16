import type { Request, Response, NextFunction } from 'express';
import type { AuthenticatedRequest } from '~/middlewares';
import { createSchemaValidator } from '~/utils';
import * as shiftService from '../services/shift.service';
import { CreateShiftSchema } from '../schema/createShiftSchema';
import { UpdateShiftSchema } from '../schema/updateShiftSchema';

const validateCreateShift = createSchemaValidator(CreateShiftSchema);
const validateUpdateShift = createSchemaValidator(UpdateShiftSchema);

const createShift = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await validateCreateShift(req.body);
    const shift = await shiftService.createShift(data);
    res.status(201).json({ message: 'Shift created successfully', data: shift });
  } catch (err) {
    next(err);
  }
};

const getShiftsByTenantId = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { tenantId } = req.query;
    const shifts = await shiftService.getShiftsByTenantId(tenantId as string);
    res.status(200).json({ data: shifts });
  } catch (err) {
    next(err);
  }
};

const getShiftById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { shiftId } = req.params;
    const { tenantId } = req.query;
    const shift = await shiftService.getShiftById(
      shiftId,
      tenantId as string,
    );
    res.status(200).json({ data: shift });
  } catch (err) {
    next(err);
  }
};

const updateShift = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { shiftId } = req.params;
    const { tenantId } = req.query;
    const data = await validateUpdateShift(req.body);
    const shift = await shiftService.updateShift(
      shiftId,
      tenantId as string,
      data,
    );
    res.status(200).json({ message: 'Shift updated successfully', data: shift });
  } catch (err) {
    next(err);
  }
};

const deleteShift = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { shiftId } = req.params;
    const { tenantId } = req.query;
    await shiftService.deleteShift(shiftId, tenantId as string);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

export { createShift, getShiftsByTenantId, getShiftById, updateShift, deleteShift };
