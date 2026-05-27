import { create } from 'zustand';
import api from '../utils/axios.js';

const DEFAULT_PAGINATION = { page: 1, limit: 10, total: 0, pages: 0 };
const DEFAULT_FILTERS = { category: '', platform: '', budgetMin: '', budgetMax: '', search: '' };

const useCampaignStore = create((set, get) => ({
  // ─── State ─────────────────────────────────────────────────────────────────
  campaigns: [],
  selectedCampaign: null,
  myCampaigns: [],
  pagination: { ...DEFAULT_PAGINATION },
  filters: { ...DEFAULT_FILTERS },
  isLoading: false,

  // ─── Filter helpers ────────────────────────────────────────────────────────
  setFilters: (filters) =>
    set((state) => ({
      filters: { ...state.filters, ...filters },
      pagination: { ...state.pagination, page: 1 },
    })),

  // ─── Async actions ─────────────────────────────────────────────────────────
  fetchCampaigns: async (filters = {}, page = 1) => {
    set({ isLoading: true });
    try {
      const params = {
        ...get().filters,
        ...filters,
        page,
        limit: get().pagination.limit,
      };
      Object.keys(params).forEach((k) => params[k] === '' && delete params[k]);
      const { data } = await api.get('/campaigns', { params });
      set({
        campaigns: data.campaigns ?? data.data ?? [],
        pagination: data.pagination ?? { ...DEFAULT_PAGINATION, page },
      });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchCampaignById: async (id) => {
    set({ isLoading: true });
    try {
      const { data } = await api.get(`/campaigns/${id}`);
      const campaign = data.campaign ?? data;
      set({ selectedCampaign: campaign });
      return campaign;
    } finally {
      set({ isLoading: false });
    }
  },

  fetchMyCampaigns: async () => {
    set({ isLoading: true });
    try {
      const { data } = await api.get('/campaigns/my');
      set({ myCampaigns: data.campaigns ?? data.data ?? [] });
    } finally {
      set({ isLoading: false });
    }
  },

  createCampaign: async (campaignData) => {
    set({ isLoading: true });
    try {
      const { data } = await api.post('/campaigns', campaignData);
      const created = data.campaign ?? data;
      set((state) => ({ myCampaigns: [created, ...state.myCampaigns] }));
      return created;
    } finally {
      set({ isLoading: false });
    }
  },

  updateCampaign: async (id, campaignData) => {
    set({ isLoading: true });
    try {
      const { data } = await api.put(`/campaigns/${id}`, campaignData);
      const updated = data.campaign ?? data;
      set((state) => ({
        myCampaigns: state.myCampaigns.map((c) => (c._id === id ? updated : c)),
        selectedCampaign: state.selectedCampaign?._id === id ? updated : state.selectedCampaign,
      }));
      return updated;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteCampaign: async (id) => {
    set({ isLoading: true });
    try {
      await api.delete(`/campaigns/${id}`);
      set((state) => ({
        myCampaigns: state.myCampaigns.filter((c) => c._id !== id),
        campaigns: state.campaigns.filter((c) => c._id !== id),
      }));
    } finally {
      set({ isLoading: false });
    }
  },

  toggleStatus: async (id) => {
    set({ isLoading: true });
    try {
      const { data } = await api.patch(`/campaigns/${id}/toggle-status`);
      const updated = data.campaign ?? data;
      set((state) => ({
        myCampaigns: state.myCampaigns.map((c) => (c._id === id ? updated : c)),
        selectedCampaign: state.selectedCampaign?._id === id ? updated : state.selectedCampaign,
      }));
      return updated;
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useCampaignStore;
