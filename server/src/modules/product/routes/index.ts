import express from 'express';
import { requireAuth } from '~/middlewares';
import { asyncHandler } from '~/utils';
import {
  createProduct,
  getProductsByTenantId,
  getProductById,
  updateProduct,
  getProductsByType,
  deactivateProduct,
  cancelScheduledPrice,
} from '../controller/product.controller';

const router = express.Router();

router.post('/', requireAuth, asyncHandler(createProduct));
router.get('/types', asyncHandler(getProductsByType));
router.get('/', requireAuth, asyncHandler(getProductsByTenantId));
router.get('/:productId', requireAuth, asyncHandler(getProductById));
router.put('/:productId', requireAuth, asyncHandler(updateProduct));
router.patch('/:productId/deactivate', requireAuth, asyncHandler(deactivateProduct));
router.delete('/:productId/scheduled-price', requireAuth, asyncHandler(cancelScheduledPrice));

export default router;
