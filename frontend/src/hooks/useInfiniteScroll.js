import { useEffect, useRef, useCallback } from 'react';

/**
 * useInfiniteScroll
 *
 * Attaches a scroll listener to a container element and triggers `callback`
 * when the user scrolls within `threshold` pixels of the bottom.
 * Prevents duplicate calls by locking while a fetch is in-flight.
 *
 * @param {() => Promise<void> | void} callback  - Function to call when near bottom
 * @param {object}  options
 * @param {number}  options.threshold  - Pixels from bottom to trigger (default 200)
 * @param {boolean} options.enabled    - Set false to disable (e.g. on last page)
 *
 * @returns {React.RefObject} Attach this ref to the scrollable container element
 *
 * @example
 *   const scrollRef = useInfiniteScroll(loadMore, { enabled: hasNextPage });
 *   return <div ref={scrollRef} className="overflow-y-auto h-screen">...</div>;
 */
const useInfiniteScroll = (callback, { threshold = 200, enabled = true } = {}) => {
  const containerRef  = useRef(null);
  const isFetchingRef = useRef(false);

  const handleScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el || isFetchingRef.current || !enabled) return;

    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;

    if (distanceFromBottom <= threshold) {
      isFetchingRef.current = true;
      Promise.resolve(callback()).finally(() => {
        isFetchingRef.current = false;
      });
    }
  }, [callback, threshold, enabled]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return containerRef;
};

export default useInfiniteScroll;
