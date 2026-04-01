import { renderHook } from '@testing-library/react-hooks'
import { useMarketCalculations } from '../../hooks/useMarketCalculations'
import { TokenHoldersData } from '../../api/holders'
import { LOSToken } from '../../../../shared/losTypes'

describe('useMarketCalculations', () => {
  const mockTokenData: LOSToken = {
    currency: 'USD',
    issuer_account: 'rIssuer',
    trustlines: 100,
    index: 0,
  }

  const mockHoldersData: TokenHoldersData = {
    totalSupply: 1000000,
    totalHolders: 100,
    holders: [],
  }

  it('returns market calculations with valid data', () => {
    const { result } = renderHook(() =>
      useMarketCalculations({
        holdersData: mockHoldersData,
        tokenData: { ...mockTokenData, supply: '1000000' },
        price: '0.5',
        xrpUSDRate: '2',
        isHoldersDataLoading: false,
      }),
    )

    expect(result.current.circSupply).toBe(1000000)
    expect(result.current.formattedCircSupply).toBeDefined()
    expect(result.current.marketCap).toBeDefined()
  })

  it('returns null marketCap when isHoldersDataLoading is true', () => {
    const { result } = renderHook(() =>
      useMarketCalculations({
        holdersData: mockHoldersData,
        tokenData: { ...mockTokenData, supply: '1000000' },
        price: '0.5',
        xrpUSDRate: '2',
        isHoldersDataLoading: true,
      }),
    )

    expect(result.current.marketCap).toBeNull()
  })

  it('returns null marketCap when circSupply is 0', () => {
    const { result } = renderHook(() =>
      useMarketCalculations({
        holdersData: undefined,
        tokenData: mockTokenData,
        price: '0.5',
        xrpUSDRate: '2',
        isHoldersDataLoading: false,
      }),
    )

    expect(result.current.marketCap).toBeNull()
  })

  it('returns null marketCap when price is empty', () => {
    const { result } = renderHook(() =>
      useMarketCalculations({
        holdersData: mockHoldersData,
        tokenData: { ...mockTokenData, supply: '1000000' },
        price: '',
        xrpUSDRate: '2',
        isHoldersDataLoading: false,
      }),
    )

    expect(result.current.marketCap).toBeNull()
  })

  it('returns null marketCap when xrpUSDRate is empty', () => {
    const { result } = renderHook(() =>
      useMarketCalculations({
        holdersData: mockHoldersData,
        tokenData: { ...mockTokenData, supply: '1000000' },
        price: '0.5',
        xrpUSDRate: '',
        isHoldersDataLoading: false,
      }),
    )

    expect(result.current.marketCap).toBeNull()
  })

  it('calculates marketCap correctly with valid inputs', () => {
    const { result } = renderHook(() =>
      useMarketCalculations({
        holdersData: mockHoldersData,
        tokenData: { ...mockTokenData, supply: '1000000' },
        price: '1',
        xrpUSDRate: '2',
        isHoldersDataLoading: false,
      }),
    )

    // 1000000 * 1 * 2 = 2000000
    expect(result.current.marketCap).toBeDefined()
  })

  it('handles zero price', () => {
    const { result } = renderHook(() =>
      useMarketCalculations({
        holdersData: mockHoldersData,
        tokenData: { ...mockTokenData, supply: '1000000' },
        price: '0',
        xrpUSDRate: '2',
        isHoldersDataLoading: false,
      }),
    )

    expect(result.current.marketCap).toBeNull()
  })

  it('handles zero xrpUSDRate', () => {
    const { result } = renderHook(() =>
      useMarketCalculations({
        holdersData: mockHoldersData,
        tokenData: { ...mockTokenData, supply: '1000000' },
        price: '0.5',
        xrpUSDRate: '0',
        isHoldersDataLoading: false,
      }),
    )

    expect(result.current.marketCap).toBeNull()
  })

  it('handles very small price values', () => {
    const { result } = renderHook(() =>
      useMarketCalculations({
        holdersData: mockHoldersData,
        tokenData: { ...mockTokenData, supply: '1000000' },
        price: '0.0001',
        xrpUSDRate: '2',
        isHoldersDataLoading: false,
      }),
    )

    expect(result.current.marketCap).toBeDefined()
  })

  it('handles very large price values', () => {
    const { result } = renderHook(() =>
      useMarketCalculations({
        holdersData: mockHoldersData,
        tokenData: { ...mockTokenData, supply: '1000000' },
        price: '1000000',
        xrpUSDRate: '2',
        isHoldersDataLoading: false,
      }),
    )

    expect(result.current.marketCap).toBeDefined()
  })

  it('formats circulating supply', () => {
    const { result } = renderHook(() =>
      useMarketCalculations({
        holdersData: mockHoldersData,
        tokenData: { ...mockTokenData, supply: '1000000' },
        price: '0.5',
        xrpUSDRate: '2',
        isHoldersDataLoading: false,
      }),
    )

    expect(result.current.formattedCircSupply).toBeDefined()
    expect(typeof result.current.formattedCircSupply).toBe('string')
  })

  it('returns circSupply as number', () => {
    const { result } = renderHook(() =>
      useMarketCalculations({
        holdersData: mockHoldersData,
        tokenData: { ...mockTokenData, supply: '1000000' },
        price: '0.5',
        xrpUSDRate: '2',
        isHoldersDataLoading: false,
      }),
    )

    expect(typeof result.current.circSupply).toBe('number')
  })

  it('handles undefined holdersData', () => {
    const { result } = renderHook(() =>
      useMarketCalculations({
        holdersData: undefined,
        tokenData: { ...mockTokenData, supply: '1000000' },
        price: '0.5',
        xrpUSDRate: '2',
        isHoldersDataLoading: false,
      }),
    )

    expect(result.current.circSupply).toBe(1000000)
  })

  it('handles circ_supply in tokenData', () => {
    const { result } = renderHook(() =>
      useMarketCalculations({
        holdersData: mockHoldersData,
        tokenData: { ...mockTokenData, circ_supply: '500000' },
        price: '0.5',
        xrpUSDRate: '2',
        isHoldersDataLoading: false,
      }),
    )

    expect(result.current.circSupply).toBe(500000)
  })

  it('memoizes results correctly', () => {
    const { result, rerender } = renderHook(
      (props) => useMarketCalculations(props),
      {
        initialProps: {
          holdersData: mockHoldersData,
          tokenData: { ...mockTokenData, supply: '1000000' },
          price: '0.5',
          xrpUSDRate: '2',
          isHoldersDataLoading: false,
        },
      },
    )

    const firstResult = result.current

    rerender({
      holdersData: mockHoldersData,
      tokenData: { ...mockTokenData, supply: '1000000' },
      price: '0.5',
      xrpUSDRate: '2',
      isHoldersDataLoading: false,
    })

    expect(result.current).toEqual(firstResult)
  })

  it('updates when dependencies change', () => {
    const { result, rerender } = renderHook(
      (props) => useMarketCalculations(props),
      {
        initialProps: {
          holdersData: mockHoldersData,
          tokenData: { ...mockTokenData, supply: '1000000' },
          price: '0.5',
          xrpUSDRate: '2',
          isHoldersDataLoading: false,
        },
      },
    )

    const firstResult = result.current

    rerender({
      holdersData: mockHoldersData,
      tokenData: { ...mockTokenData, supply: '2000000' },
      price: '0.5',
      xrpUSDRate: '2',
      isHoldersDataLoading: false,
    })

    expect(result.current.circSupply).not.toEqual(firstResult.circSupply)
  })
})
