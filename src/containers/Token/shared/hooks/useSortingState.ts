import { useState } from 'react'

/**
 * Sorting state for a single table
 */
export interface TableSortingState {
  sortField?: string
  setSortField?: (field: string) => void
  sortOrder?: 'asc' | 'desc'
  setSortOrder?: (order: 'asc' | 'desc') => void
}

/**
 * Custom hook to manage sorting state for a table
 */
export const useSortingState = (
  initialSortField: string = 'timestamp',
  initialSortOrder: 'asc' | 'desc' = 'desc',
): TableSortingState => {
  const [sortField, setSortField] = useState(initialSortField)
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(initialSortOrder)

  return {
    sortField,
    setSortField,
    sortOrder,
    setSortOrder,
  }
}
