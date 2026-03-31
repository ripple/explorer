import { useState, useCallback, useEffect } from 'react'
import {
  CursorPaginationService,
  PaginationResult,
} from '../services/CursorPaginationService'

interface UseCursorPaginatedQueryOptions<T> {
  /** The pagination service instance */
  service: CursorPaginationService<T>
  /** Identifier passed to the service (e.g., token ID, AMM account ID) */
  id: string
  /** Items per page */
  pageSize: number
  /** Whether the query is enabled */
  enabled?: boolean
  /** Initial sort field */
  initialSortField?: string
  /** Initial sort order */
  initialSortOrder?: 'asc' | 'desc'
}

interface UseCursorPaginatedQueryResult<T> {
  data: PaginationResult<T> | undefined
  isLoading: boolean
  page: number
  setPage: (page: number) => void
  sortField: string
  setSortField: (field: string) => void
  sortOrder: 'asc' | 'desc'
  setSortOrder: (order: 'asc' | 'desc') => void
  refresh: () => void
}

/**
 * React bridge for CursorPaginationService. Manages page/sort/refresh state
 * and data fetching so each consumer doesn't duplicate ~70 lines of
 * useState/useEffect/useCallback boilerplate.
 *
 * Used by IOU (2), MPT (1), and AMM Pool (3) pages.
 *
 * Page changes keep previous data visible (no loading flash).
 * Sort changes and refresh show a loader because the cache is cleared.
 */
export function useCursorPaginatedQuery<T>({
  service,
  id,
  pageSize,
  enabled = true,
  initialSortField = 'timestamp',
  initialSortOrder = 'desc',
}: UseCursorPaginatedQueryOptions<T>): UseCursorPaginatedQueryResult<T> {
  const [page, setPage] = useState(1)
  const [sortField, setSortFieldState] = useState(initialSortField)
  const [sortOrder, setSortOrderState] = useState<'asc' | 'desc'>(
    initialSortOrder,
  )
  const [refreshCount, setRefreshCount] = useState(0)

  const setSortField = useCallback(
    (field: string) => {
      setSortFieldState(field)
      setPage(1)
      service.clearCache()
    },
    [service],
  )

  const setSortOrder = useCallback(
    (order: 'asc' | 'desc') => {
      setSortOrderState(order)
      setPage(1)
      service.clearCache()
    },
    [service],
  )

  const refresh = useCallback(() => {
    service.clearCache()
    setPage(1)
    setRefreshCount((c) => c + 1)
  }, [service])

  const [data, setData] = useState<PaginationResult<T> | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!enabled) {
      return undefined
    }

    let cancelled = false

    service
      .getPage(id, page, pageSize, sortField, sortOrder)
      .then((result) => {
        if (!cancelled) {
          setData(result)
          setIsLoading(false)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setData(undefined)
          setIsLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [enabled, service, id, page, pageSize, sortField, sortOrder, refreshCount])

  return {
    data,
    isLoading,
    page,
    setPage,
    sortField,
    setSortField,
    sortOrder,
    setSortOrder,
    refresh,
  }
}
