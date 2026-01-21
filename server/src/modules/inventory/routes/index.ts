import express from 'express';
import { requireAuth } from '~/middlewares';
import { asyncHandler } from '~/utils';
import {
  createInventory,
  getInventoriesByTenantId,
  getInventoryById,
  updateInventory,
  deleteInventory,
} from '../controller/inventory.controller';

const router = express.Router();

router.post('/', requireAuth, asyncHandler(createInventory));
router.get('/', requireAuth, asyncHandler(getInventoriesByTenantId));
router.get('/:inventoryId', requireAuth, asyncHandler(getInventoryById));
router.put('/:inventoryId', requireAuth, asyncHandler(updateInventory));
router.delete('/:inventoryId', requireAuth, asyncHandler(deleteInventory));

export default router;
