import { renderHook, act } from '@testing-library/react-hooks'
import { useSortingState } from '../../hooks/useSortingState'

describe('useSortingState', () => {
  it('initializes with default values', () => {
    const { result } = renderHook(() => useSortingState())

    expect(result.current.sortField).toBe('timestamp')
    expect(result.current.sortOrder).toBe('desc')
  })

  it('initializes with custom sortField', () => {
    const { result } = renderHook(() => useSortingState('name'))

    expect(result.current.sortField).toBe('name')
    expect(result.current.sortOrder).toBe('desc')
  })

  it('initializes with custom sortOrder', () => {
    const { result } = renderHook(() => useSortingState('timestamp', 'asc'))

    expect(result.current.sortField).toBe('timestamp')
    expect(result.current.sortOrder).toBe('asc')
  })

  it('initializes with custom sortField and sortOrder', () => {
    const { result } = renderHook(() => useSortingState('amount', 'asc'))

    expect(result.current.sortField).toBe('amount')
    expect(result.current.sortOrder).toBe('asc')
  })

  it('updates sortField when setSortField is called', () => {
    const { result } = renderHook(() => useSortingState())

    act(() => {
      result.current.setSortField?.('name')
    })

    expect(result.current.sortField).toBe('name')
  })

  it('updates sortOrder when setSortOrder is called', () => {
    const { result } = renderHook(() => useSortingState())

    act(() => {
      result.current.setSortOrder?.('asc')
    })

    expect(result.current.sortOrder).toBe('asc')
  })

  it('handles multiple sortField updates', () => {
    const { result } = renderHook(() => useSortingState())

    act(() => {
      result.current.setSortField?.('name')
    })
    expect(result.current.sortField).toBe('name')

    act(() => {
      result.current.setSortField?.('amount')
    })
    expect(result.current.sortField).toBe('amount')

    act(() => {
      result.current.setSortField?.('timestamp')
    })
    expect(result.current.sortField).toBe('timestamp')
  })

  it('handles multiple sortOrder updates', () => {
    const { result } = renderHook(() => useSortingState())

    act(() => {
      result.current.setSortOrder?.('asc')
    })
    expect(result.current.sortOrder).toBe('asc')

    act(() => {
      result.current.setSortOrder?.('desc')
    })
    expect(result.current.sortOrder).toBe('desc')

    act(() => {
      result.current.setSortOrder?.('asc')
    })
    expect(result.current.sortOrder).toBe('asc')
  })

  it('maintains sortField when updating sortOrder', () => {
    const { result } = renderHook(() => useSortingState('name', 'desc'))

    act(() => {
      result.current.setSortOrder?.('asc')
    })

    expect(result.current.sortField).toBe('name')
    expect(result.current.sortOrder).toBe('asc')
  })

  it('maintains sortOrder when updating sortField', () => {
    const { result } = renderHook(() => useSortingState('timestamp', 'asc'))

    act(() => {
      result.current.setSortField?.('amount')
    })

    expect(result.current.sortField).toBe('amount')
    expect(result.current.sortOrder).toBe('asc')
  })

  it('returns setSortField function', () => {
    const { result } = renderHook(() => useSortingState())

    expect(typeof result.current.setSortField).toBe('function')
  })

  it('returns setSortOrder function', () => {
    const { result } = renderHook(() => useSortingState())

    expect(typeof result.current.setSortOrder).toBe('function')
  })

  it('handles empty string sortField', () => {
    const { result } = renderHook(() => useSortingState(''))

    expect(result.current.sortField).toBe('')
  })

  it('handles special characters in sortField', () => {
    const { result } = renderHook(() => useSortingState('field_name'))

    expect(result.current.sortField).toBe('field_name')
  })

  it('handles numeric sortField names', () => {
    const { result } = renderHook(() => useSortingState('field123'))

    expect(result.current.sortField).toBe('field123')
  })

  it('provides all required properties', () => {
    const { result } = renderHook(() => useSortingState())

    expect(result.current).toHaveProperty('sortField')
    expect(result.current).toHaveProperty('setSortField')
    expect(result.current).toHaveProperty('sortOrder')
    expect(result.current).toHaveProperty('setSortOrder')
  })

  it('handles updating both sortField and sortOrder', () => {
    const { result } = renderHook(() => useSortingState('timestamp', 'desc'))

    act(() => {
      result.current.setSortField?.('amount')
      result.current.setSortOrder?.('asc')
    })

    expect(result.current.sortField).toBe('amount')
    expect(result.current.sortOrder).toBe('asc')
  })

  it('handles long sortField names', () => {
    const longFieldName = 'very_long_field_name_with_many_characters'
    const { result } = renderHook(() => useSortingState(longFieldName))

    expect(result.current.sortField).toBe(longFieldName)
  })

  it('handles camelCase sortField names', () => {
    const { result } = renderHook(() => useSortingState('sortByAmount'))

    expect(result.current.sortField).toBe('sortByAmount')
  })

  it('handles snake_case sortField names', () => {
    const { result } = renderHook(() => useSortingState('sort_by_amount'))

    expect(result.current.sortField).toBe('sort_by_amount')
  })

  it('maintains state across multiple operations', () => {
    const { result } = renderHook(() => useSortingState('name', 'asc'))

    act(() => {
      result.current.setSortField?.('amount')
    })
    expect(result.current.sortField).toBe('amount')
    expect(result.current.sortOrder).toBe('asc')

    act(() => {
      result.current.setSortOrder?.('desc')
    })
    expect(result.current.sortField).toBe('amount')
    expect(result.current.sortOrder).toBe('desc')

    act(() => {
      result.current.setSortField?.('timestamp')
    })
    expect(result.current.sortField).toBe('timestamp')
    expect(result.current.sortOrder).toBe('desc')
  })
})
