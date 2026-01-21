import express from 'express';
import { requireAuth } from '~/middlewares';
import { asyncHandler } from '~/utils';
import {
  createStockInventory,
  getStockInventoriesByTenantId,
  getStockInventoryById,
  updateStockInventory,
  deleteStockInventory,
} from '../controller/stock-inventory.controller';

const router = express.Router();

router.post('/', requireAuth, asyncHandler(createStockInventory));
router.get('/', requireAuth, asyncHandler(getStockInventoriesByTenantId));
router.get('/:inventoryId', requireAuth, asyncHandler(getStockInventoryById));
router.put('/:inventoryId', requireAuth, asyncHandler(updateStockInventory));
router.delete('/:inventoryId', requireAuth, asyncHandler(deleteStockInventory));

export default router;
