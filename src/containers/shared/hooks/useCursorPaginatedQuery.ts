import { useState, useCallback } from 'react'
import { useQuery } from 'react-query'
import {
  CursorPaginationService,
  PaginationResult,
} from '../services/CursorPaginationService'

interface UseCursorPaginatedQueryOptions<T> {
  /** Unique query key prefix */
  queryKey: string
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
 * Hook that wraps CursorPaginationService with react-query,
 * handling sort/page/refresh state automatically.
 *
 * On sort change: resets page to 1 and clears the service cache.
 * On refresh: clears cache, resets page, and forces a refetch.
 */
export function useCursorPaginatedQuery<T>({
  queryKey,
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

  const { data, isLoading } = useQuery(
    [queryKey, id, page, sortField, sortOrder, refreshCount],
    () => service.getPage(id, page, pageSize, sortField, sortOrder),
    { enabled },
  )

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
