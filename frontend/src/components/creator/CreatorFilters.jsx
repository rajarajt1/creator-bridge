import { useState } from 'react';
import { SlidersHorizontal, ChevronDown, ChevronUp } from 'lucide-react';
import { NICHE_OPTIONS, PLATFORM_OPTIONS } from '../../utils/constants.js';
import Button from '../ui/Button.jsx';
import Input from '../ui/Input.jsx';
import Select from '../ui/Select.jsx';

const DEFAULT = {
  niche: [],
  platform: '',
  minFollowers: '',
  location: '',
  availability: '',
};

const CreatorFilters = ({ filters = {}, onApply, onReset, className = '' }) => {
  const [local, setLocal] = useState({
    niche:        Array.isArray(filters.niche) ? filters.niche : [],
    platform:     filters.platform     ?? '',
    minFollowers: filters.minFollowers ?? '',
    location:     filters.location     ?? '',
    availability: filters.availability ?? '',
  });
  const [open, setOpen] = useState(false); // collapsed on mobile by default

  const set = (key, value) => setLocal((prev) => ({ ...prev, [key]: value }));

  const toggleNiche = (value) =>
    setLocal((prev) => ({
      ...prev,
      niche: prev.niche.includes(value)
        ? prev.niche.filter((v) => v !== value)
        : [...prev.niche, value],
    }));

  const handleApply = () => onApply?.({ ...local });

  const handleReset = () => {
    setLocal({ ...DEFAULT });
    onReset?.({ ...DEFAULT });
  };

  return (
    <div className={`bg-white rounded-xl border border-gray-200 overflow-hidden ${className}`}>
      {/* Toggle header (always visible) */}
      <button
        type="button"
        className="flex w-full items-center justify-between px-4 py-3.5 text-sm font-semibold text-gray-900"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-indigo-600" />
          Filters
        </span>
        {open ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
      </button>

      {open && (
        <div className="border-t border-gray-100 px-4 pb-5 pt-4 space-y-5">
          {/* Niche */}
          <fieldset>
            <legend className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Niche</legend>
            <div className="grid grid-cols-2 gap-x-3 gap-y-2">
              {NICHE_OPTIONS.map(({ value, label }) => (
                <label key={value} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={local.niche.includes(value)}
                    onChange={() => toggleNiche(value)}
                    className="h-3.5 w-3.5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  {label}
                </label>
              ))}
            </div>
          </fieldset>

          {/* Platform */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Platform</p>
            <Select
              options={PLATFORM_OPTIONS}
              value={local.platform}
              placeholder="Any platform"
              onChange={(e) => set('platform', e.target.value)}
            />
          </div>

          {/* Min followers */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Min Followers</p>
            <Input
              type="number"
              placeholder="e.g. 10,000"
              min="0"
              value={local.minFollowers}
              onChange={(e) => set('minFollowers', e.target.value)}
            />
          </div>

          {/* Location */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Location</p>
            <Input
              placeholder="City, State or Country"
              value={local.location}
              onChange={(e) => set('location', e.target.value)}
            />
          </div>

          {/* Availability toggle */}
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700">Available only</p>
            <button
              type="button"
              role="switch"
              aria-checked={local.availability === 'true'}
              onClick={() => set('availability', local.availability === 'true' ? '' : 'true')}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 ${
                local.availability === 'true' ? 'bg-indigo-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-3.5 w-3.5 translate-y-0 rounded-full bg-white shadow transition-transform ${
                  local.availability === 'true' ? 'translate-x-[18px]' : 'translate-x-0.5'
                }`}
              />
            </button>
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

export default CreatorFilters;
