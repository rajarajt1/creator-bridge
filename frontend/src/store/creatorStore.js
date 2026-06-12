import { create } from 'zustand';
import api from '../utils/axios.js';
import useAuthStore from './authStore.js';

const DEFAULT_PAGINATION = { page: 1, limit: 12, total: 0, pages: 0 };
const DEFAULT_FILTERS = { niche: '', minFollowers: '', location: '', availability: '', platform: '' };

const useCreatorStore = create((set, get) => ({
  // ─── State ─────────────────────────────────────────────────────────────────
  profile: null,
  creators: [],
  selectedCreator: null,
  pagination: { ...DEFAULT_PAGINATION },
  filters: { ...DEFAULT_FILTERS },
  isLoading: false,
  error: null,

  // ─── Filter helpers ────────────────────────────────────────────────────────
  setFilters: (filters) =>
    set((state) => ({
      filters: { ...state.filters, ...filters },
      pagination: { ...state.pagination, page: 1 },
    })),

  resetFilters: () =>
    set({ filters: { ...DEFAULT_FILTERS }, pagination: { ...DEFAULT_PAGINATION } }),

  // ─── Async actions ─────────────────────────────────────────────────────────
  fetchMyProfile: async () => {
    set({ isLoading: true, error: null });
    try {
      const role = useAuthStore.getState().user?.role;
      const endpoint = role === 'business' ? '/business/profile' : '/creators/profile';
      const { data } = await api.get(endpoint);
      set({ profile: data.profile ?? data.creator ?? data });
    } catch (err) {
      set({ error: err.response?.data?.message ?? 'Failed to fetch profile' });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  fetchCreators: async (filters = {}, page = 1) => {
    set({ isLoading: true, error: null });
    try {
      const params = {
        ...get().filters,
        ...filters,
        page,
        limit: get().pagination.limit,
      };
      // Strip empty values
      Object.keys(params).forEach((k) => params[k] === '' && delete params[k]);
      const { data } = await api.get('/creators', { params });
      set({
        creators: data.creators ?? data.data ?? [],
        pagination: data.pagination ?? { ...DEFAULT_PAGINATION, page },
      });
    } catch (err) {
      set({ error: err.response?.data?.message ?? 'Failed to fetch creators' });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  fetchCreatorById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.get(`/creators/${id}`);
      const creator = data.creator ?? data.profile ?? data;
      set({ selectedCreator: creator });
      return creator;
    } catch (err) {
      set({ error: err.response?.data?.message ?? 'Creator not found' });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  updateProfile: async (profileData) => {
    set({ isLoading: true, error: null });
    try {
      const role = useAuthStore.getState().user?.role;
      const endpoint = role === 'business' ? '/business/profile' : '/creators/profile';
      const { data } = await api.put(endpoint, profileData);
      const updated = data.profile ?? data.creator ?? data;
      set({ profile: updated });
      return updated;
    } catch (err) {
      set({ error: err.response?.data?.message ?? 'Failed to update profile' });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  addPortfolioItem: async (itemData) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post('/creators/portfolio', itemData);
      const updated = data.profile ?? data.creator ?? data;
      set({ profile: updated });
      return updated;
    } catch (err) {
      set({ error: err.response?.data?.message ?? 'Failed to add portfolio item' });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  removePortfolioItem: async (itemId) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.delete(`/creators/portfolio/${itemId}`);
      const updated = data.profile ?? data.creator ?? data;
      set({ profile: updated });
      return updated;
    } catch (err) {
      set({ error: err.response?.data?.message ?? 'Failed to remove portfolio item' });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useCreatorStore;
