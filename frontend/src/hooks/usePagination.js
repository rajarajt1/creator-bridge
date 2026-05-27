import { useState, useCallback } from 'react';

/**
 * usePagination
 *
 * Manages page cursor state independently from data-fetching stores so any
 * page or list component can own its own pagination controls.
 *
 * @param {number} initialPage       - Starting page (default 1)
 * @param {number} initialTotalPages - Known total page count (default 1)
 *
 * @returns {object} Pagination state and control methods
 *
 * @example
 *   const { currentPage, totalPages, setTotalPages, nextPage, prevPage, goToPage, reset } = usePagination();
 *   useEffect(() => { fetchData(currentPage); }, [currentPage]);
 *   useEffect(() => { setTotalPages(apiResponse.pages); }, [apiResponse]);
 */
const usePagination = (initialPage = 1, initialTotalPages = 1) => {
  const [currentPage,  setCurrentPage]  = useState(initialPage);
  const [totalPages,   _setTotalPages]  = useState(initialTotalPages);

  const nextPage = useCallback(() => {
    setCurrentPage((p) => Math.min(p + 1, totalPages));
  }, [totalPages]);

  const prevPage = useCallback(() => {
    setCurrentPage((p) => Math.max(p - 1, 1));
  }, []);

  const goToPage = useCallback((page) => {
    setCurrentPage(Math.max(1, Math.min(Number(page), totalPages)));
  }, [totalPages]);

  const reset = useCallback(() => setCurrentPage(1), []);

  /** Call this when the API returns the total page count */
  const setTotalPages = useCallback((total) => {
    const safeTotal = Math.max(Number(total) || 1, 1);
    _setTotalPages(safeTotal);
    // Clamp current page in case it's now out of range
    setCurrentPage((p) => Math.min(p, safeTotal));
  }, []);

  return {
    currentPage,
    totalPages,
    setTotalPages,
    nextPage,
    prevPage,
    goToPage,
    reset,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
  };
};

export default usePagination;
