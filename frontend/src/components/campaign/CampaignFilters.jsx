import { useState } from 'react';
import { SlidersHorizontal, ChevronDown, ChevronUp } from 'lucide-react';
import { NICHE_OPTIONS, PLATFORM_OPTIONS } from '../../utils/constants.js';
import Button from '../ui/Button.jsx';
import Input from '../ui/Input.jsx';
import Select from '../ui/Select.jsx';
import SearchInput from '../ui/SearchInput.jsx';

const CONTENT_TYPES = [
  { value: 'post',       label: 'Post' },
  { value: 'story',      label: 'Story' },
  { value: 'reel',       label: 'Reel / Short' },
  { value: 'video',      label: 'Long-form Video' },
  { value: 'review',     label: 'Review' },
  { value: 'unboxing',   label: 'Unboxing' },
  { value: 'livestream', label: 'Livestream' },
];

const SORT_OPTIONS = [
  { value: 'createdAt', label: 'Newest First' },
  { value: '-deadline', label: 'Deadline (Soonest)' },
  { value: '-budget',   label: 'Budget (High → Low)' },
  { value: 'budget',    label: 'Budget (Low → High)' },
];

const DEFAULT = {
  search: '',
  category: '',
  platforms: [],
  budgetMin: '',
  budgetMax: '',
  contentType: [],
  sortBy: 'createdAt',
};

const CampaignFilters = ({ filters = {}, onApply, onReset, className = '' }) => {
  const [local, setLocal] = useState({
    search:      filters.search      ?? '',
    category:    filters.category    ?? '',
    platforms:   Array.isArray(filters.platforms)    ? filters.platforms    : [],
    budgetMin:   filters.budgetMin   ?? '',
    budgetMax:   filters.budgetMax   ?? '',
    contentType: Array.isArray(filters.contentType)  ? filters.contentType  : [],
    sortBy:      filters.sortBy      ?? 'createdAt',
  });
  const [open, setOpen] = useState(false);

  const set = (key, value) => setLocal((prev) => ({ ...prev, [key]: value }));

  const toggleArr = (key, value) =>
    setLocal((prev) => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter((v) => v !== value)
        : [...prev[key], value],
    }));

  const handleApply = () => onApply?.({ ...local });

  const handleReset = () => {
    setLocal({ ...DEFAULT });
    onReset?.({ ...DEFAULT });
  };

  return (
    <div className={`bg-white rounded-xl border border-gray-200 overflow-hidden ${className}`}>
      {/* Search always visible */}
      <div className="p-3 border-b border-gray-100">
        <SearchInput
          value={local.search}
          onChange={(v) => set('search', v)}
          onSearch={(v) => onApply?.({ ...local, search: v })}
          placeholder="Search campaigns…"
        />
      </div>

      {/* Toggle */}
      <button
        type="button"
        className="flex w-full items-center justify-between px-4 py-3 text-sm font-semibold text-gray-900"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-indigo-600" />
          More Filters
        </span>
        {open ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
      </button>

      {open && (
        <div className="border-t border-gray-100 px-4 pb-5 pt-4 space-y-5">
          {/* Category */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Category</p>
            <Select
              options={NICHE_OPTIONS}
              value={local.category}
              placeholder="All categories"
              onChange={(e) => set('category', e.target.value)}
            />
          </div>

          {/* Platform checkboxes */}
          <fieldset>
            <legend className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Platform</legend>
            <div className="grid grid-cols-2 gap-x-3 gap-y-2">
              {PLATFORM_OPTIONS.map(({ value, label }) => (
                <label key={value} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={local.platforms.includes(value)}
                    onChange={() => toggleArr('platforms', value)}
                    className="h-3.5 w-3.5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  {label}
                </label>
              ))}
            </div>
          </fieldset>

          {/* Budget range */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Budget (₹)</p>
            <div className="flex gap-2 items-center">
              <Input
                type="number"
                placeholder="Min"
                min="0"
                value={local.budgetMin}
                onChange={(e) => set('budgetMin', e.target.value)}
                className="flex-1"
              />
              <span className="text-gray-400 shrink-0">–</span>
              <Input
                type="number"
                placeholder="Max"
                min="0"
                value={local.budgetMax}
                onChange={(e) => set('budgetMax', e.target.value)}
                className="flex-1"
              />
            </div>
          </div>

          {/* Content type */}
          <fieldset>
            <legend className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Content Type</legend>
            <div className="grid grid-cols-2 gap-x-3 gap-y-2">
              {CONTENT_TYPES.map(({ value, label }) => (
                <label key={value} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={local.contentType.includes(value)}
                    onChange={() => toggleArr('contentType', value)}
                    className="h-3.5 w-3.5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  {label}
                </label>
              ))}
            </div>
          </fieldset>

          {/* Sort */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Sort By</p>
            <Select
              options={SORT_OPTIONS}
              value={local.sortBy}
              placeholder="Sort by…"
              onChange={(e) => set('sortBy', e.target.value)}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <Button variant="primary" size="sm" className="flex-1" onClick={handleApply}>
              Apply Filters
            </Button>
            <Button variant="ghost" size="sm" className="flex-1" onClick={handleReset}>
              Reset
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignFilters;
