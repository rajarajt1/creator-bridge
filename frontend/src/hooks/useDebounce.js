import { useState, useEffect } from 'react';

/**
 * useDebounce
 *
 * Returns a debounced copy of `value` that only updates after `delay` ms
 * of inactivity. Use in search inputs to reduce API calls while typing.
 *
 * @param {*}      value - The value to debounce (any type)
 * @param {number} delay - Debounce delay in milliseconds (default 400ms)
 * @returns debounced value
 *
 * @example
 *   const debouncedSearch = useDebounce(searchInput, 400);
 *   useEffect(() => { fetchResults(debouncedSearch); }, [debouncedSearch]);
 */
const useDebounce = (value, delay = 400) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
