import { useMemo } from 'react';

const POSTS_PER_PAGE = 6;

interface UsePaginationReturn<T> {
  page: number;
  totalPages: number;
  pageItems: T[];
  setPage: (p: number) => void;
  hasNext: boolean;
  hasPrev: boolean;
}

export function usePagination<T>(
  items: T[],
  page: number,
  setPage: (p: number) => void,
): UsePaginationReturn<T> {
  const totalPages = Math.max(1, Math.ceil(items.length / POSTS_PER_PAGE));
  const safePage = Math.min(page, totalPages);

  const pageItems = useMemo(
    () => items.slice((safePage - 1) * POSTS_PER_PAGE, safePage * POSTS_PER_PAGE),
    [items, safePage],
  );

  return {
    page: safePage,
    totalPages,
    pageItems,
    setPage,
    hasNext: safePage < totalPages,
    hasPrev: safePage > 1,
  };
}
