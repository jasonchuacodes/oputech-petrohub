import { prisma } from '~/db/index';
import { NotificationType, NotificationStatus, Prisma } from '~/db/prisma';
import { NotFoundError, ForbiddenError } from '~/errors';

const createNotification = async (
  type: NotificationType,
  metadata: Prisma.InputJsonValue,
  recipientIds: string[],
) => {
  await prisma.notification.createManyAndReturn({
    data: recipientIds.map((recipientId) => ({
      type,
      status: NotificationStatus.UNREAD,
      recipientId,
      metadata,
    })),
  });
};

const getNotifications = async (userId: string, filter?: { status?: NotificationStatus }) => {
  return await prisma.notification.findMany({
    where: {
      recipientId: userId,
      ...(filter?.status && { status: filter.status }),
    },
    orderBy: { createdAt: 'desc' },
  });
};

const getUnreadCount = async (userId: string) => {
  return await prisma.notification.count({
    where: {
      recipientId: userId,
      status: NotificationStatus.UNREAD,
    },
  });
};

const markAsRead = async (notificationId: string, userId: string) => {
  const notification = await prisma.notification.findUnique({
    where: { id: notificationId },
  });

  if (!notification) {
    throw new NotFoundError('Notification not found');
  }

  if (notification.recipientId !== userId) {
    throw new ForbiddenError('You cannot access this notification');
  }

  return await prisma.notification.update({
    where: { id: notificationId },
    data: { status: NotificationStatus.READ },
  });
};

const deleteNotification = async (notificationId: string, userId: string) => {
  const notification = await prisma.notification.findUnique({
    where: { id: notificationId },
  });

  if (!notification) {
    throw new NotFoundError('Notification not found');
  }

  if (notification.recipientId !== userId) {
    throw new ForbiddenError('You cannot delete this notification');
  }

  await prisma.notification.delete({
    where: { id: notificationId },
  });
};

export { createNotification, getNotifications, getUnreadCount, markAsRead, deleteNotification };
