import axios from '~/lib/axiosInstance';
import type { ApiResponse } from '~/types/api';
import type { Notification, NotificationStatus } from './notification.types';

const getNotifications = async (status?: NotificationStatus) => {
  const params = status ? { status } : {};
  const res = await axios.get<
    ApiResponse<{ notifications: Notification[]; unreadCount: number }>
  >('/notifications', { params });
  return res.data.data;
};

const markAsRead = (notificationId: string) => {
  return axios.patch(`/notifications/${notificationId}/read`);
};

const deleteNotification = (notificationId: string) => {
  return axios.delete(`/notifications/${notificationId}`);
};

export { getNotifications, markAsRead, deleteNotification };
