import express from 'express';
import { requireAuth } from '~/middlewares';
import { asyncHandler } from '~/utils';
import {
  createProduct,
  getProductsByTenantId,
  getProductById,
  updateProduct,
  deleteProduct,
} from '../controller/product.controller';

const router = express.Router();

router.post('/', requireAuth, asyncHandler(createProduct));
router.get('/', requireAuth, asyncHandler(getProductsByTenantId));
router.get('/:productId', requireAuth, asyncHandler(getProductById));
router.put('/:productId', requireAuth, asyncHandler(updateProduct));
router.delete('/:productId', requireAuth, asyncHandler(deleteProduct));

export default router;
