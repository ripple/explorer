import { renderHook, act, waitFor } from '@testing-library/react'
import { CursorPaginationService } from '../../services/CursorPaginationService'
import { useCursorPaginatedQuery } from '../useCursorPaginatedQuery'

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
    const { result } = renderHook(() =>
      useCursorPaginatedQuery({
        service: mockService,
        id: 'testId',
        pageSize: 10,
      }),
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
    const { result } = renderHook(() =>
      useCursorPaginatedQuery({
        service: mockService,
        id: 'testId',
        pageSize: 10,
        initialSortField: 'amount',
        initialSortOrder: 'asc',
      }),
    )

    await waitFor(() => {
      expect(result.current.data).toBeDefined()
    })

    expect(mockGetPage).toHaveBeenCalledWith('testId', 1, 10, 'amount', 'asc')
    expect(result.current.sortField).toBe('amount')
    expect(result.current.sortOrder).toBe('asc')
  })

  it('does not fetch when disabled', () => {
    renderHook(() =>
      useCursorPaginatedQuery({
        service: mockService,
        id: 'testId',
        pageSize: 10,
        enabled: false,
      }),
    )

    expect(mockGetPage).not.toHaveBeenCalled()
  })

  it('resets page to 1 and clears cache when sort field changes', async () => {
    const { result } = renderHook(() =>
      useCursorPaginatedQuery({
        service: mockService,
        id: 'testId',
        pageSize: 10,
      }),
    )

    await waitFor(() => {
      expect(result.current.data).toBeDefined()
    })

    act(() => {
      result.current.setPage(2)
    })
    expect(result.current.page).toBe(2)

    act(() => {
      result.current.setSortField('amount')
    })

    expect(result.current.page).toBe(1)
    expect(result.current.sortField).toBe('amount')
    expect(mockClearCache).toHaveBeenCalled()
  })

  it('resets page to 1 and clears cache when sort order changes', async () => {
    const { result } = renderHook(() =>
      useCursorPaginatedQuery({
        service: mockService,
        id: 'testId',
        pageSize: 10,
      }),
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
    const { result } = renderHook(() =>
      useCursorPaginatedQuery({
        service: mockService,
        id: 'testId',
        pageSize: 10,
      }),
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

  it('shows loading on sort change', async () => {
    const { result } = renderHook(() =>
      useCursorPaginatedQuery({
        service: mockService,
        id: 'testId',
        pageSize: 10,
      }),
    )

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    act(() => {
      result.current.setSortField('amount')
    })

    expect(result.current.isLoading).toBe(true)
  })

  it('shows loading on refresh', async () => {
    const { result } = renderHook(() =>
      useCursorPaginatedQuery({
        service: mockService,
        id: 'testId',
        pageSize: 10,
      }),
    )

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    act(() => {
      result.current.refresh()
    })

    expect(result.current.isLoading).toBe(true)
  })

  it('does not show loading on page change (no flash)', async () => {
    const { result } = renderHook(() =>
      useCursorPaginatedQuery({
        service: mockService,
        id: 'testId',
        pageSize: 10,
      }),
    )

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    act(() => {
      result.current.setPage(2)
    })

    // isLoading stays false — previous data remains visible
    expect(result.current.isLoading).toBe(false)
  })

  it('fetches new data when page changes', async () => {
    const { result } = renderHook(() =>
      useCursorPaginatedQuery({
        service: mockService,
        id: 'testId',
        pageSize: 10,
      }),
    )

    await waitFor(() => {
      expect(result.current.data).toBeDefined()
    })

    mockGetPage.mockClear()

    act(() => {
      result.current.setPage(2)
    })

    await waitFor(() => {
      expect(mockGetPage).toHaveBeenCalledWith(
        'testId',
        2,
        10,
        'timestamp',
        'desc',
      )
    })
  })

  it('sets data to undefined on fetch error', async () => {
    mockGetPage.mockRejectedValueOnce(new Error('fetch failed'))

    const { result } = renderHook(() =>
      useCursorPaginatedQuery({
        service: mockService,
        id: 'testId',
        pageSize: 10,
      }),
    )

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.data).toBeUndefined()
  })

  it('ignores stale response after unmount', async () => {
    let resolveGetPage: (value: any) => void
    mockGetPage.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveGetPage = resolve
        }),
    )

    const { result, unmount } = renderHook(() =>
      useCursorPaginatedQuery({
        service: mockService,
        id: 'testId',
        pageSize: 10,
      }),
    )

    expect(result.current.isLoading).toBe(true)

    unmount()

    // Resolve after unmount — should not throw or update state
    act(() => {
      resolveGetPage!({
        items: [{ id: 99 }],
        totalItems: 1,
        hasMore: false,
        isLoading: false,
      })
    })

    // No error thrown — stale response was ignored
  })
})
