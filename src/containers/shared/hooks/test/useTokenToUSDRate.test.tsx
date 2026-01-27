import { renderHook } from '@testing-library/react-hooks'
import { waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { useTokenToUSDRate } from '../useTokenToUSDRate'
import * as useXRPToUSDRateModule from '../useXRPToUSDRate'

jest.mock('../useXRPToUSDRate')
const mockUseXRPToUSDRate = useXRPToUSDRateModule.useXRPToUSDRate as jest.Mock

// Mock global fetch
const mockFetch = jest.fn()
global.fetch = mockFetch

const createWrapper =
  (
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: 0 } },
    }),
  ) =>
  ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )

describe('useTokenToUSDRate', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUseXRPToUSDRate.mockReturnValue(2.5) // XRP = $2.50
    process.env.VITE_ENVIRONMENT = 'mainnet'
  })

  describe('Special Currencies', () => {
    it('returns XRP/USD rate directly for XRP', () => {
      const { result } = renderHook(
        () => useTokenToUSDRate({ currency: 'XRP' }),
        {
          wrapper: createWrapper(),
        },
      )
      expect(result.current).toEqual({
        rate: 2.5,
        isAvailable: true,
        isLoading: false,
      })
    })

    it('returns 1:1 rate for RLUSD stablecoin', () => {
      const { result } = renderHook(
        () => useTokenToUSDRate({ currency: 'RLUSD', issuer: 'rSomeIssuer' }),
        { wrapper: createWrapper() },
      )
      expect(result.current).toEqual({
        rate: 1,
        isAvailable: true,
        isLoading: false,
      })
    })
  })

  describe('XRPLMeta API - Positive Cases', () => {
    it('fetches token price and converts to USD', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ metrics: { price: 0.5 } }), // 0.5 XRP per token
      })

      const { result } = renderHook(
        () => useTokenToUSDRate({ currency: 'USD', issuer: 'rIssuer123' }),
        { wrapper: createWrapper() },
      )

      await waitFor(() => expect(result.current.isLoading).toBe(false))
      // 0.5 XRP * $2.50/XRP = $1.25
      expect(result.current).toEqual({
        rate: 1.25,
        isAvailable: true,
        isLoading: false,
      })
      expect(mockFetch).toHaveBeenCalledWith(
        'https://s1.xrplmeta.org/token/USD%3ArIssuer123',
      )
    })
  })

  describe('XRPLMeta API - Negative Cases', () => {
    it('returns unavailable when API returns no price', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ metrics: {} }), // No price field
      })

      const { result } = renderHook(
        () => useTokenToUSDRate({ currency: 'RARE', issuer: 'rIssuer456' }),
        { wrapper: createWrapper() },
      )

      await waitFor(() => expect(result.current.isLoading).toBe(false))
      expect(result.current).toEqual({
        rate: 0,
        isAvailable: false,
        isLoading: false,
      })
    })

    it('returns unavailable when API request fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        statusText: 'Not Found',
      })

      const { result } = renderHook(
        () => useTokenToUSDRate({ currency: 'UNKNOWN', issuer: 'rIssuer789' }),
        { wrapper: createWrapper() },
      )

      await waitFor(() => expect(result.current.isLoading).toBe(false))
      expect(result.current).toEqual({
        rate: 0,
        isAvailable: false,
        isLoading: false,
      })
    })

    it('returns unavailable for token without issuer', () => {
      const { result } = renderHook(
        () => useTokenToUSDRate({ currency: 'FOO' }), // No issuer
        { wrapper: createWrapper() },
      )
      expect(result.current).toEqual({
        rate: 0,
        isAvailable: false,
        isLoading: false,
      })
      expect(mockFetch).not.toHaveBeenCalled()
    })
  })

  describe('Non-Mainnet Environment', () => {
    it('returns mock rate for tokens on non-mainnet', () => {
      process.env.VITE_ENVIRONMENT = 'testnet'

      const { result } = renderHook(
        () => useTokenToUSDRate({ currency: 'TEST', issuer: 'rTestIssuer' }),
        { wrapper: createWrapper() },
      )

      expect(result.current).toEqual({
        rate: 1.5,
        isAvailable: true,
        isLoading: false,
      })
      expect(mockFetch).not.toHaveBeenCalled()
    })
  })
})
