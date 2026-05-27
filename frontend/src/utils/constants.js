export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

// ─── Niches ──────────────────────────────────────────────────────────────────

export const NICHE_OPTIONS = [
  { value: 'tech',          label: 'Tech' },
  { value: 'fashion',       label: 'Fashion' },
  { value: 'food',          label: 'Food' },
  { value: 'travel',        label: 'Travel' },
  { value: 'fitness',       label: 'Fitness' },
  { value: 'gaming',        label: 'Gaming' },
  { value: 'beauty',        label: 'Beauty' },
  { value: 'education',     label: 'Education' },
  { value: 'lifestyle',     label: 'Lifestyle' },
  { value: 'finance',       label: 'Finance' },
  { value: 'entertainment', label: 'Entertainment' },
  { value: 'other',         label: 'Other' },
];

// ─── Platforms ───────────────────────────────────────────────────────────────

export const PLATFORM_OPTIONS = [
  { value: 'instagram', label: 'Instagram' },
  { value: 'youtube',   label: 'YouTube' },
  { value: 'tiktok',    label: 'TikTok' },
  { value: 'twitter',   label: 'Twitter / X' },
  { value: 'facebook',  label: 'Facebook' },
  { value: 'linkedin',  label: 'LinkedIn' },
];

// ─── Budget types ─────────────────────────────────────────────────────────────

export const BUDGET_TYPES = [
  { value: 'fixed',         label: 'Fixed Price' },
  { value: 'negotiable',    label: 'Negotiable' },
  { value: 'product-based', label: 'Product / Barter' },
];

// ─── Application statuses ─────────────────────────────────────────────────────

export const APPLICATION_STATUSES = [
  { value: 'pending',   label: 'Pending' },
  { value: 'reviewing', label: 'Under Review' },
  { value: 'accepted',  label: 'Accepted' },
  { value: 'rejected',  label: 'Rejected' },
  { value: 'withdrawn', label: 'Withdrawn' },
];

// ─── Campaign statuses ────────────────────────────────────────────────────────

export const CAMPAIGN_STATUSES = [
  { value: 'draft',     label: 'Draft' },
  { value: 'active',    label: 'Active' },
  { value: 'paused',    label: 'Paused' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];
