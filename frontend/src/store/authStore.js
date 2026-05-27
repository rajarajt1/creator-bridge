import { create } from 'zustand';
import api from '../utils/axios.js';

const useAuthStore = create((set) => ({
  // ─── State ─────────────────────────────────────────────────────────────────
  user: null,
  accessToken: localStorage.getItem('accessToken') ?? null,
  isAuthenticated: !!localStorage.getItem('accessToken'),
  isLoading: false,

  // ─── Primitive setters ─────────────────────────────────────────────────────
  setUser: (user) => set({ user, isAuthenticated: !!user }),

  setAccessToken: (token) => {
    if (token) {
      localStorage.setItem('accessToken', token);
    } else {
      localStorage.removeItem('accessToken');
    }
    set({ accessToken: token });
  },

  updateUser: (data) =>
    set((state) => ({ user: state.user ? { ...state.user, ...data } : data })),

  // ─── Async actions ─────────────────────────────────────────────────────────
  login: async (credentials) => {
    set({ isLoading: true });
    try {
      const { data } = await api.post('/auth/login', credentials);
      const { user, accessToken } = data;
      localStorage.setItem('accessToken', accessToken);
      if (data.user) localStorage.setItem('user', JSON.stringify(user));
      set({ user, accessToken, isAuthenticated: true });
      return user;
    } finally {
      set({ isLoading: false });
    }
  },

  register: async (userData) => {
    set({ isLoading: true });
    try {
      const { data } = await api.post('/auth/register', userData);
      const { user, accessToken } = data;
      localStorage.setItem('accessToken', accessToken);
      if (data.user) localStorage.setItem('user', JSON.stringify(user));
      set({ user, accessToken, isAuthenticated: true });
      return user;
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Proceed with client-side cleanup even if the request fails
    }
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    set({ user: null, accessToken: null, isAuthenticated: false });
    window.location.href = '/';
  },

  getMe: async () => {
    set({ isLoading: true });
    try {
      const { data } = await api.get('/auth/me');
      set({ user: data.user, isAuthenticated: true });
      return data.user;
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useAuthStore;
