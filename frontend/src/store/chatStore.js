import { create } from 'zustand';
import api from '../utils/axios.js';

const useChatStore = create((set, get) => ({
  // ─── State ─────────────────────────────────────────────────────────────────
  conversations: [],
  activeConversation: null, // userId of the other participant
  messages: [],
  isLoading: false,
  unreadCount: 0,
  typingUsers: {}, // { [conversationId]: boolean }

  // ─── Async actions ─────────────────────────────────────────────────────────
  fetchConversations: async () => {
    set({ isLoading: true });
    try {
      const { data } = await api.get('/messages/conversations');
      const conversations = data.conversations ?? [];
      set({ conversations });
      get().updateUnreadCount();
    } finally {
      set({ isLoading: false });
    }
  },

  fetchMessages: async (userId, page = 1) => {
    set({ isLoading: true });
    try {
      const { data } = await api.get(`/messages/${userId}`, { params: { page, limit: 30 } });
      const incoming = data.messages ?? [];
      if (page === 1) {
        // Reverse so oldest appears first in the UI
        set({ messages: [...incoming].reverse() });
      } else {
        // Prepend older messages when paginating backward
        set((state) => ({ messages: [...incoming.reverse(), ...state.messages] }));
      }
      return data.pagination;
    } finally {
      set({ isLoading: false });
    }
  },

  sendMessage: async (receiverId, content) => {
    // Optimistic update
    const tempId = `temp_${Date.now()}`;
    const optimistic = { _id: tempId, content, receiverId, sending: true, createdAt: new Date().toISOString() };
    set((state) => ({ messages: [...state.messages, optimistic] }));

    try {
      const { data } = await api.post('/messages', { receiverId, content });
      const created = data.message ?? data;
      // Replace optimistic entry with confirmed message
      set((state) => ({
        messages: state.messages.map((m) => (m._id === tempId ? created : m)),
      }));
      return created;
    } catch (err) {
      // Remove optimistic entry on failure
      set((state) => ({ messages: state.messages.filter((m) => m._id !== tempId) }));
      throw err;
    }
  },

  markRead: async (conversationId) => {
    try {
      await api.patch('/messages/read', { conversationId });
      // Clear unread count for this conversation in local state
      set((state) => ({
        conversations: state.conversations.map((c) =>
          c.conversationId === conversationId ? { ...c, unreadCount: 0 } : c
        ),
      }));
      get().updateUnreadCount();
    } catch {
      // Non-critical; ignore failures silently
    }
  },

  setActiveConversation: async (userId) => {
    set({ activeConversation: userId, messages: [] });
    if (userId) {
      await get().fetchMessages(userId);
    }
  },

  // ─── Real-time helpers (called by Socket.io listeners) ────────────────────

  addMessage: (message) => {
    set((state) => ({ messages: [...state.messages, message] }));
    // Move conversation to the top with updated last message
    set((state) => {
      const exists = state.conversations.find((c) => c.conversationId === message.conversationId);
      if (!exists) return {};
      const updated = { ...exists, lastMessage: message };
      const rest = state.conversations.filter((c) => c.conversationId !== message.conversationId);
      return { conversations: [updated, ...rest] };
    });
    get().updateUnreadCount();
  },

  setTyping: (conversationId, isTyping) =>
    set((state) => ({
      typingUsers: { ...state.typingUsers, [conversationId]: isTyping },
    })),

  updateUnreadCount: () => {
    const total = get().conversations.reduce((sum, c) => sum + (c.unreadCount ?? 0), 0);
    set({ unreadCount: total });
  },
}));

export default useChatStore;
