import express from 'express';
import { requireAuth } from '~/middlewares';
import { asyncHandler } from '~/utils';
import {
  createShift,
  getShiftsByTenantId,
  getShiftById,
  updateShift,
  deleteShift,
  getShiftPeriods,
} from '../controller/shift.controller';

const router = express.Router();

router.post('/', requireAuth, asyncHandler(createShift));
router.get('/periods', requireAuth, asyncHandler(getShiftPeriods));
router.get('/', requireAuth, asyncHandler(getShiftsByTenantId));
router.get('/:shiftId', requireAuth, asyncHandler(getShiftById));
router.put('/:shiftId', requireAuth, asyncHandler(updateShift));
router.delete('/:shiftId', requireAuth, asyncHandler(deleteShift));

export default router;
