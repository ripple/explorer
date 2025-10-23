import { useState } from 'react'

/**
 * Pagination state for a single table
 */
export interface TablePaginationState {
  currentPage: number
  setCurrentPage: (page: number) => void
  pageSize: number
  total: number
  hasMore?: boolean
  hasPrevPage?: boolean
}

/**
 * Custom hook to manage pagination state for a table
 */
export const usePaginationState = (
  pageSize: number,
  total: number = 0,
  hasMore?: boolean,
  hasPrevPage?: boolean,
): TablePaginationState => {
  const [currentPage, setCurrentPage] = useState(1)

  return {
    currentPage,
    setCurrentPage,
    pageSize,
    total,
    hasMore,
    hasPrevPage,
  }
}

