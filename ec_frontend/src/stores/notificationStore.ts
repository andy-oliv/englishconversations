import { create } from "zustand";
import type { Notification } from "../schemas/notification.schema";

export interface NotificationStoreState {
  notifications: Notification[];
  setNotifications: (notifications: Notification[]) => void;
  addNotification: (data: Notification) => void;
  setIsRead: (notificationId: string) => void;
  setAllRead: () => void;
  resetNotifications: () => void;
}

export const useNotificationStore = create<NotificationStoreState>((set) => ({
  notifications: [],
  setNotifications: (data) => {
    set({ notifications: data });
  },
  addNotification: (newNotification) =>
    set((state) => ({
      notifications: [newNotification, ...state.notifications],
    })),
  setIsRead: (notificationId) =>
    set((state) => ({
      notifications: state.notifications.map((notification) =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification
      ),
    })),
  setAllRead: () =>
    set((state) => ({
      notifications: state.notifications.map((notification) => ({
        ...notification,
        isRead: true,
      })),
    })),
  resetNotifications: () => set({ notifications: [] }),
}));
