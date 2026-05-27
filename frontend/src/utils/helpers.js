import { format, formatDistanceToNow } from 'date-fns';

// ─── Numbers / currency ───────────────────────────────────────────────────────

/**
 * Format a large number into a compact human-readable string.
 * 1200 → '1.2K', 3_400_000 → '3.4M'
 */
export const formatNumber = (num) => {
  if (num == null || isNaN(num)) return '0';
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000)     return `${(num / 1_000).toFixed(1)}K`;
  return String(num);
};

/**
 * Format a number as Indian-locale currency.
 * formatCurrency(15000, 'INR') → '₹15,000'
 */
export const formatCurrency = (amount, currency = 'INR') =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount ?? 0);

// ─── Dates ────────────────────────────────────────────────────────────────────

/**
 * Format a date into a readable string.
 * formatDate(new Date()) → 'May 27, 2026'
 */
export const formatDate = (date) => {
  if (!date) return '';
  return format(new Date(date), 'MMM d, yyyy');
};

/**
 * Return a relative time string.
 * formatRelativeTime(date) → '2 hours ago'
 */
export const formatRelativeTime = (date) => {
  if (!date) return '';
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};

// ─── Strings ──────────────────────────────────────────────────────────────────

/**
 * Get initials (up to 2 characters) from a full name.
 * getInitials('John Doe') → 'JD'
 */
export const getInitials = (name) => {
  if (!name) return '?';
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');
};

/**
 * Truncate text to a maximum length, appending '…' if needed.
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  return text.length > maxLength ? `${text.slice(0, maxLength)}…` : text;
};

// ─── Conversations ────────────────────────────────────────────────────────────

/**
 * Generate a deterministic conversation ID from two user IDs.
 * Matches the server-side Message.generateConversationId() logic.
 */
export const generateConversationId = (id1, id2) =>
  [String(id1), String(id2)].sort().join('_');

