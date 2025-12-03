import { NextFunction, Response } from 'express';
import { AuthenticatedRequest } from '~/middlewares';
import * as notificationService from '../services/notification.service';
import { NotificationStatus } from '~/db/prisma';

const getNotifications = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user!.id;
    const status = req.query.status as NotificationStatus | undefined;

    const notifications = await notificationService.getNotifications(
      userId,
      status ? { status } : undefined,
    );
    const unreadCount = await notificationService.getUnreadCount(userId);

    res.status(200).json({
      message: 'Notifications retrieved successfully',
      data: {
        notifications,
        unreadCount,
      },
    });
  } catch (err) {
    next(err);
  }
};

const markAsRead = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    const notification = await notificationService.markAsRead(id, userId);

    res.status(200).json({
      message: 'Notification marked as read',
      data: { notification },
    });
  } catch (err) {
    next(err);
  }
};

const deleteNotification = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    await notificationService.deleteNotification(id, userId);

    res.status(200).json({
      message: 'Notification deleted successfully',
    });
  } catch (err) {
    next(err);
  }
};

export { getNotifications, markAsRead, deleteNotification };
