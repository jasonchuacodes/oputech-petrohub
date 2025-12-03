import type { ValueOf } from '~/utils/valueOf';

export const NotificationType = {
  PASSWORD_RESET_REQUEST: 'PASSWORD_RESET_REQUEST',
  DEFAULT: 'DEFAULT',
} as const;
export type NotificationType = ValueOf<typeof NotificationType>;

export const NotificationStatus = {
  UNREAD: 'UNREAD',
  READ: 'READ',
} as const;
export type NotificationStatus = ValueOf<typeof NotificationStatus>;
export interface PasswordResetRequestMetadata {
  userId: string;
  username: string;
  requestedAt: string;
}

export interface DefaultMetadata {
  title: string;
  message: string;
}

export interface PasswordResetRequestNotification {
  id: string;
  type: typeof NotificationType.PASSWORD_RESET_REQUEST;
  status: NotificationStatus;
  metadata: PasswordResetRequestMetadata;
  recipientId: string;
  createdAt: string;
  updatedAt: string;
}

export interface DefaultNotification {
  id: string;
  type: typeof NotificationType.DEFAULT;
  status: NotificationStatus;
  metadata: DefaultMetadata;
  recipientId: string;
  createdAt: string;
  updatedAt: string;
}

export type Notification = PasswordResetRequestNotification | DefaultNotification;

