import { create } from 'zustand';
import api from '../utils/axios.js';

const useApplicationStore = create((set) => ({
  // ─── State ─────────────────────────────────────────────────────────────────
  myApplications: [],
  campaignApplications: [],
  isLoading: false,

  // ─── Async actions ─────────────────────────────────────────────────────────
  apply: async (campaignId, applicationData) => {
    set({ isLoading: true });
    try {
      const { data } = await api.post('/applications', { campaignId, ...applicationData });
      const created = data.application ?? data;
      set((state) => ({ myApplications: [created, ...state.myApplications] }));
      return created;
    } finally {
      set({ isLoading: false });
    }
  },

  fetchMyApplications: async (status) => {
    set({ isLoading: true });
    try {
      const params = status ? { status } : {};
      const { data } = await api.get('/applications/my', { params });
      set({ myApplications: data.applications ?? data.data ?? [] });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchCampaignApplications: async (campaignId, status) => {
    set({ isLoading: true });
    try {
      const params = status ? { status } : {};
      const { data } = await api.get(`/applications/campaign/${campaignId}`, { params });
      set({ campaignApplications: data.applications ?? data.data ?? [] });
    } finally {
      set({ isLoading: false });
    }
  },

  updateStatus: async (applicationId, status, notes) => {
    set({ isLoading: true });
    try {
      const { data } = await api.patch(`/applications/${applicationId}/status`, { status, businessNotes: notes });
      const updated = data.application ?? data;
      set((state) => ({
        campaignApplications: state.campaignApplications.map((a) =>
          a._id === applicationId ? updated : a
        ),
      }));
      return updated;
    } finally {
      set({ isLoading: false });
    }
  },

  withdraw: async (applicationId) => {
    set({ isLoading: true });
    try {
      await api.delete(`/applications/${applicationId}`);
      set((state) => ({
        myApplications: state.myApplications.filter((a) => a._id !== applicationId),
      }));
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useApplicationStore;
