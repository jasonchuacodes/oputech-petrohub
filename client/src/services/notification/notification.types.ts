export enum NotificationType {
  PASSWORD_RESET_REQUEST = 'PASSWORD_RESET_REQUEST',
}

export enum NotificationStatus {
  UNREAD = 'UNREAD',
  READ = 'READ',
}

export interface PasswordResetRequestMetadata {
  userId: string;
  username: string;
  requestedAt: string;
}

export interface Notification {
  id: string;
  type: NotificationType;
  status: NotificationStatus;
  metadata: PasswordResetRequestMetadata;
  recipientId: string;
  createdAt: string;
  updatedAt: string;
}
