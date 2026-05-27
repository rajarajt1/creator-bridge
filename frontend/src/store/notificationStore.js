import { create } from 'zustand';
import api from '../utils/axios.js';

const useNotificationStore = create((set, get) => ({
  // ─── State ─────────────────────────────────────────────────────────────────
  notifications: [],
  unreadCount: 0,
  isLoading: false,

  // ─── Async actions ─────────────────────────────────────────────────────────
  fetchNotifications: async () => {
    set({ isLoading: true });
    try {
      const { data } = await api.get('/notifications');
      const notifications = data.notifications ?? data.data ?? [];
      const unreadCount = notifications.filter((n) => !n.isRead).length;
      set({ notifications, unreadCount });
    } catch {
      // Endpoint may not be wired yet; fail silently
    } finally {
      set({ isLoading: false });
    }
  },

  markRead: async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      set((state) => ({
        notifications: state.notifications.map((n) =>
          n._id === id ? { ...n, isRead: true } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      }));
    } catch {
      // Non-critical
    }
  },

  markAllRead: async () => {
    try {
      await api.patch('/notifications/read-all');
      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
        unreadCount: 0,
      }));
    } catch {
      // Non-critical
    }
  },

  // ─── Real-time helpers (called by Socket.io listeners) ────────────────────

  addNotification: (notification) => {
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    }));
  },

  incrementUnread: () =>
    set((state) => ({ unreadCount: state.unreadCount + 1 })),
}));

export default useNotificationStore;
