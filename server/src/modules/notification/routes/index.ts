import express from 'express';
import { requireAuth } from '~/middlewares';
import { asyncHandler } from '~/utils';
import {
  getNotifications,
  markAsRead,
  deleteNotification,
} from '../controller/notification.controller';

const router = express.Router();

router.get('/', requireAuth, asyncHandler(getNotifications));
router.patch('/:id/read', requireAuth, asyncHandler(markAsRead));
router.delete('/:id', requireAuth, asyncHandler(deleteNotification));

export default router;
