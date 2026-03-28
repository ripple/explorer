import { renderHook, act } from '@testing-library/react-hooks'
import { waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { CursorPaginationService } from '../../services/CursorPaginationService'
import { useCursorPaginatedQuery } from '../useCursorPaginatedQuery'

const createWrapper =
  (
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    }),
  ) =>
  ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )

describe('useCursorPaginatedQuery', () => {
  let mockService: CursorPaginationService<any>
  let mockGetPage: jest.Mock
  let mockClearCache: jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()
    mockGetPage = jest.fn().mockResolvedValue({
      items: [{ id: 1 }, { id: 2 }],
      totalItems: 20,
      hasMore: true,
      isLoading: false,
    })
    mockClearCache = jest.fn()
    mockService = {
      getPage: mockGetPage,
      clearCache: mockClearCache,
    } as any
  })

  it('fetches page 1 on initial render', async () => {
    const { result } = renderHook(
      () =>
        useCursorPaginatedQuery({
          queryKey: 'test',
          service: mockService,
          id: 'testId',
          pageSize: 10,
        }),
      { wrapper: createWrapper() },
    )

    await waitFor(() => {
      expect(result.current.data).toBeDefined()
    })

    expect(mockGetPage).toHaveBeenCalledWith(
      'testId',
      1,
      10,
      'timestamp',
      'desc',
    )
    expect(result.current.page).toBe(1)
    expect(result.current.sortField).toBe('timestamp')
    expect(result.current.sortOrder).toBe('desc')
  })

  it('uses custom initial sort field and order', async () => {
    const { result } = renderHook(
      () =>
        useCursorPaginatedQuery({
          queryKey: 'test',
          service: mockService,
          id: 'testId',
          pageSize: 10,
          initialSortField: 'amount',
          initialSortOrder: 'asc',
        }),
      { wrapper: createWrapper() },
    )

    await waitFor(() => {
      expect(result.current.data).toBeDefined()
    })

    expect(mockGetPage).toHaveBeenCalledWith('testId', 1, 10, 'amount', 'asc')
    expect(result.current.sortField).toBe('amount')
    expect(result.current.sortOrder).toBe('asc')
  })

  it('does not fetch when disabled', () => {
    renderHook(
      () =>
        useCursorPaginatedQuery({
          queryKey: 'test',
          service: mockService,
          id: 'testId',
          pageSize: 10,
          enabled: false,
        }),
      { wrapper: createWrapper() },
    )

    expect(mockGetPage).not.toHaveBeenCalled()
  })

  it('resets page to 1 and clears cache when sort field changes', async () => {
    const { result } = renderHook(
      () =>
        useCursorPaginatedQuery({
          queryKey: 'test-sort',
          service: mockService,
          id: 'testId',
          pageSize: 10,
        }),
      { wrapper: createWrapper() },
    )

    await waitFor(() => {
      expect(result.current.data).toBeDefined()
    })

    // Navigate to page 2
    act(() => {
      result.current.setPage(2)
    })
    expect(result.current.page).toBe(2)

    // Change sort field — should reset to page 1 and clear cache
    act(() => {
      result.current.setSortField('amount')
    })

    expect(result.current.page).toBe(1)
    expect(result.current.sortField).toBe('amount')
    expect(mockClearCache).toHaveBeenCalled()
  })

  it('resets page to 1 and clears cache when sort order changes', async () => {
    const { result } = renderHook(
      () =>
        useCursorPaginatedQuery({
          queryKey: 'test-order',
          service: mockService,
          id: 'testId',
          pageSize: 10,
        }),
      { wrapper: createWrapper() },
    )

    await waitFor(() => {
      expect(result.current.data).toBeDefined()
    })

    act(() => {
      result.current.setPage(3)
    })

    act(() => {
      result.current.setSortOrder('asc')
    })

    expect(result.current.page).toBe(1)
    expect(result.current.sortOrder).toBe('asc')
    expect(mockClearCache).toHaveBeenCalled()
  })

  it('clears cache and resets page on refresh', async () => {
    const { result } = renderHook(
      () =>
        useCursorPaginatedQuery({
          queryKey: 'test-refresh',
          service: mockService,
          id: 'testId',
          pageSize: 10,
        }),
      { wrapper: createWrapper() },
    )

    await waitFor(() => {
      expect(result.current.data).toBeDefined()
    })

    act(() => {
      result.current.setPage(5)
    })

    act(() => {
      result.current.refresh()
    })

    expect(result.current.page).toBe(1)
    expect(mockClearCache).toHaveBeenCalled()
  })

  it('returns loading state while fetching', () => {
    // Make getPage hang (never resolve)
    mockGetPage.mockReturnValue(new Promise(() => {}))

    const { result } = renderHook(
      () =>
        useCursorPaginatedQuery({
          queryKey: 'test-loading',
          service: mockService,
          id: 'testId',
          pageSize: 10,
        }),
      { wrapper: createWrapper() },
    )

    expect(result.current.isLoading).toBe(true)
    expect(result.current.data).toBeUndefined()
  })
})
