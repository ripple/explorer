import { renderHook, act } from '@testing-library/react-hooks'
import { usePaginationState } from '../../hooks/usePaginationState'

describe('usePaginationState', () => {
  it('initializes with default values', () => {
    const { result } = renderHook(() => usePaginationState(10))

    expect(result.current.currentPage).toBe(1)
    expect(result.current.pageSize).toBe(10)
    expect(result.current.total).toBe(0)
    expect(result.current.hasMore).toBeUndefined()
    expect(result.current.hasPrevPage).toBeUndefined()
  })

  it('initializes with provided pageSize', () => {
    const { result } = renderHook(() => usePaginationState(20))

    expect(result.current.pageSize).toBe(20)
  })

  it('initializes with provided total', () => {
    const { result } = renderHook(() => usePaginationState(10, 100))

    expect(result.current.total).toBe(100)
  })

  it('initializes with hasMore flag', () => {
    const { result } = renderHook(() => usePaginationState(10, 100, true))

    expect(result.current.hasMore).toBe(true)
  })

  it('initializes with hasPrevPage flag', () => {
    const { result } = renderHook(() => usePaginationState(10, 100, true, true))

    expect(result.current.hasPrevPage).toBe(true)
  })

  it('initializes with all parameters', () => {
    const { result } = renderHook(() =>
      usePaginationState(20, 200, true, false),
    )

    expect(result.current.pageSize).toBe(20)
    expect(result.current.total).toBe(200)
    expect(result.current.hasMore).toBe(true)
    expect(result.current.hasPrevPage).toBe(false)
  })

  it('updates currentPage when setCurrentPage is called', () => {
    const { result } = renderHook(() => usePaginationState(10))

    act(() => {
      result.current.setCurrentPage(2)
    })

    expect(result.current.currentPage).toBe(2)
  })

  it('updates currentPage to any valid number', () => {
    const { result } = renderHook(() => usePaginationState(10))

    act(() => {
      result.current.setCurrentPage(5)
    })

    expect(result.current.currentPage).toBe(5)
  })

  it('handles multiple page updates', () => {
    const { result } = renderHook(() => usePaginationState(10))

    act(() => {
      result.current.setCurrentPage(2)
    })
    expect(result.current.currentPage).toBe(2)

    act(() => {
      result.current.setCurrentPage(3)
    })
    expect(result.current.currentPage).toBe(3)

    act(() => {
      result.current.setCurrentPage(1)
    })
    expect(result.current.currentPage).toBe(1)
  })

  it('handles large page numbers', () => {
    const { result } = renderHook(() => usePaginationState(10))

    act(() => {
      result.current.setCurrentPage(1000)
    })

    expect(result.current.currentPage).toBe(1000)
  })

  it('handles zero page number', () => {
    const { result } = renderHook(() => usePaginationState(10))

    act(() => {
      result.current.setCurrentPage(0)
    })

    expect(result.current.currentPage).toBe(0)
  })

  it('handles negative page number', () => {
    const { result } = renderHook(() => usePaginationState(10))

    act(() => {
      result.current.setCurrentPage(-1)
    })

    expect(result.current.currentPage).toBe(-1)
  })

  it('maintains pageSize across updates', () => {
    const { result } = renderHook(() => usePaginationState(15, 150))

    act(() => {
      result.current.setCurrentPage(2)
    })

    expect(result.current.pageSize).toBe(15)
  })

  it('maintains total across updates', () => {
    const { result } = renderHook(() => usePaginationState(10, 100))

    act(() => {
      result.current.setCurrentPage(2)
    })

    expect(result.current.total).toBe(100)
  })

  it('returns setCurrentPage function', () => {
    const { result } = renderHook(() => usePaginationState(10))

    expect(typeof result.current.setCurrentPage).toBe('function')
  })

  it('handles zero pageSize', () => {
    const { result } = renderHook(() => usePaginationState(0))

    expect(result.current.pageSize).toBe(0)
  })

  it('handles large pageSize', () => {
    const { result } = renderHook(() => usePaginationState(1000))

    expect(result.current.pageSize).toBe(1000)
  })

  it('handles zero total', () => {
    const { result } = renderHook(() => usePaginationState(10, 0))

    expect(result.current.total).toBe(0)
  })

  it('handles large total', () => {
    const { result } = renderHook(() => usePaginationState(10, 1000000))

    expect(result.current.total).toBe(1000000)
  })

  it('handles hasMore as false', () => {
    const { result } = renderHook(() => usePaginationState(10, 100, false))

    expect(result.current.hasMore).toBe(false)
  })

  it('handles hasPrevPage as false', () => {
    const { result } = renderHook(() =>
      usePaginationState(10, 100, true, false),
    )

    expect(result.current.hasPrevPage).toBe(false)
  })

  it('provides all required properties', () => {
    const { result } = renderHook(() => usePaginationState(10, 100, true, true))

    expect(result.current).toHaveProperty('currentPage')
    expect(result.current).toHaveProperty('setCurrentPage')
    expect(result.current).toHaveProperty('pageSize')
    expect(result.current).toHaveProperty('total')
    expect(result.current).toHaveProperty('hasMore')
    expect(result.current).toHaveProperty('hasPrevPage')
  })
})
