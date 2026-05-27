import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';

const DEBOUNCE_MS = 300;

const SearchInput = ({
  value,
  onChange,
  placeholder = 'Search…',
  onSearch,
  className = '',
  ...rest
}) => {
  const [localValue, setLocalValue] = useState(value ?? '');
  const timerRef = useRef(null);

  // Keep in sync when parent controls value externally
  useEffect(() => {
    if (value !== undefined) setLocalValue(value);
  }, [value]);

  const handleChange = (e) => {
    const val = e.target.value;
    setLocalValue(val);
    onChange?.(val);

    if (onSearch) {
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => onSearch(val), DEBOUNCE_MS);
    }
  };

  const handleClear = () => {
    clearTimeout(timerRef.current);
    setLocalValue('');
    onChange?.('');
    onSearch?.('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && onSearch) {
      clearTimeout(timerRef.current);
      onSearch(localValue);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />

      <input
        type="text"
        value={localValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full rounded-lg border border-gray-300 pl-10 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
        {...rest}
      />

      {localValue && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default SearchInput;
