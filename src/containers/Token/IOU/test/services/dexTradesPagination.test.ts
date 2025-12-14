import { dexTradesPaginationService } from '../../services/dexTradesPagination'

import { getDexTrades } from '../../../shared/api/tokenTx'

jest.mock('../../../shared/api/tokenTx', () => ({
  getDexTrades: jest.fn(),
}))

const mockGetDexTrades = getDexTrades as jest.Mock

describe('DexTradesPaginationService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    dexTradesPaginationService.clearCache()
  })

  describe('getDexTradesPage', () => {
    it('returns empty trades on first call with no data', async () => {
      mockGetDexTrades.mockResolvedValue({
        results: [],
        next_cursor: null,
      })

      const result = await dexTradesPaginationService.getDexTradesPage(
        'USD.rIssuer',
        1,
      )

      expect(result.trades).toEqual([])
      expect(result.totalTrades).toBe(0)
      expect(result.hasMore).toBe(false)
    })

    it('fetches and returns trades on first page', async () => {
      const mockTrades = [
        {
          hash: 'hash1',
          ledger_index: 100,
          timestamp: 1000,
          dex_trades: [
            {
              from: 'rFrom1',
              to: 'rTo1',
              amount_in: { currency: 'USD', issuer: 'rIssuer', value: '100' },
              amount_out: { currency: 'XRP', issuer: '', value: '50' },
            },
          ],
        },
      ]

      mockGetDexTrades.mockResolvedValue({
        results: mockTrades,
        next_cursor: 'cursor1',
      })

      const result = await dexTradesPaginationService.getDexTradesPage(
        'USD.rIssuer',
        1,
      )

      expect(result.trades.length).toBe(1)
      expect(result.totalTrades).toBe(1)
      expect(result.hasMore).toBe(false)
    })

    it('uses default page size when not provided', async () => {
      mockGetDexTrades.mockResolvedValue({
        results: [],
        next_cursor: null,
      })

      await dexTradesPaginationService.getDexTradesPage('USD.rIssuer', 1)

      expect(mockGetDexTrades).toHaveBeenCalledWith(
        'USD.rIssuer',
        200,
        undefined,
        'next',
        undefined,
        undefined,
      )
    })

    it('uses custom page size when provided', async () => {
      mockGetDexTrades.mockResolvedValue({
        results: [],
        next_cursor: null,
      })

      await dexTradesPaginationService.getDexTradesPage('USD.rIssuer', 1, 20)

      expect(mockGetDexTrades).toHaveBeenCalled()
    })

    it('handles multiple pages correctly', async () => {
      const mockTrades = Array.from({ length: 200 }, (_, i) => ({
        hash: `hash${i}`,
        ledger_index: 100 + i,
        timestamp: 1000 + i,
        dex_trades: [
          {
            from: `rFrom${i}`,
            to: `rTo${i}`,
            amount_in: { currency: 'USD', issuer: 'rIssuer', value: '100' },
            amount_out: { currency: 'XRP', issuer: '', value: '50' },
          },
        ],
      }))

      mockGetDexTrades.mockResolvedValue({
        results: mockTrades,
        next_cursor: 'cursor1',
      })

      const result1 = await dexTradesPaginationService.getDexTradesPage(
        'USD.rIssuer',
        1,
        10,
      )

      expect(result1.trades.length).toBe(10)
      expect(result1.hasMore).toBe(true)
    })

    it('caches trades between calls', async () => {
      const mockTrades = [
        {
          hash: 'hash1',
          ledger_index: 100,
          timestamp: 1000,
          dex_trades: [
            {
              from: 'rFrom1',
              to: 'rTo1',
              amount_in: { currency: 'USD', issuer: 'rIssuer', value: '100' },
              amount_out: { currency: 'XRP', issuer: '', value: '50' },
            },
          ],
        },
      ]

      mockGetDexTrades.mockResolvedValue({
        results: mockTrades,
        next_cursor: null,
      })

      await dexTradesPaginationService.getDexTradesPage('USD.rIssuer', 1)
      const callCount1 = mockGetDexTrades.mock.calls.length

      await dexTradesPaginationService.getDexTradesPage('USD.rIssuer', 1)
      const callCount2 = mockGetDexTrades.mock.calls.length

      // Should not fetch again for same page
      expect(callCount2).toBe(callCount1)
    })

    it('handles sorting parameters', async () => {
      mockGetDexTrades.mockResolvedValue({
        results: [],
        next_cursor: null,
      })

      await dexTradesPaginationService.getDexTradesPage(
        'USD.rIssuer',
        1,
        10,
        'timestamp',
        'asc',
      )

      expect(mockGetDexTrades).toHaveBeenCalledWith(
        'USD.rIssuer',
        200,
        undefined,
        'next',
        'timestamp',
        'asc',
      )
    })

    it('returns correct hasMore flag', async () => {
      const mockTrades = Array.from({ length: 200 }, (_, i) => ({
        hash: `hash${i}`,
        ledger_index: 100 + i,
        timestamp: 1000 + i,
        dex_trades: [
          {
            from: `rFrom${i}`,
            to: `rTo${i}`,
            amount_in: { currency: 'USD', issuer: 'rIssuer', value: '100' },
            amount_out: { currency: 'XRP', issuer: '', value: '50' },
          },
        ],
      }))

      mockGetDexTrades.mockResolvedValue({
        results: mockTrades,
        next_cursor: 'cursor1',
      })

      const result = await dexTradesPaginationService.getDexTradesPage(
        'USD.rIssuer',
        1,
        10,
      )

      expect(result.hasMore).toBe(true)
    })
  })

  describe('clearCache', () => {
    it('clears cache for specific tokenId', async () => {
      mockGetDexTrades.mockResolvedValue({
        results: [],
        next_cursor: null,
      })

      await dexTradesPaginationService.getDexTradesPage('USD.rIssuer', 1)
      dexTradesPaginationService.clearCache('USD.rIssuer')

      const count1 = mockGetDexTrades.mock.calls.length
      await dexTradesPaginationService.getDexTradesPage('USD.rIssuer', 1)
      const count2 = mockGetDexTrades.mock.calls.length

      expect(count2).toBeGreaterThan(count1)
    })

    it('clears all caches when no parameters provided', async () => {
      mockGetDexTrades.mockResolvedValue({
        results: [],
        next_cursor: null,
      })

      await dexTradesPaginationService.getDexTradesPage('USD.rIssuer', 1)
      dexTradesPaginationService.clearCache()

      const count1 = mockGetDexTrades.mock.calls.length
      await dexTradesPaginationService.getDexTradesPage('USD.rIssuer', 1)
      const count2 = mockGetDexTrades.mock.calls.length

      expect(count2).toBeGreaterThan(count1)
    })
  })

  describe('getCachedTradesCount', () => {
    it('returns 0 for uncached tokenId', () => {
      const count =
        dexTradesPaginationService.getCachedTradesCount('USD.rIssuer')
      expect(count).toBe(0)
    })

    it('returns correct count after fetching', async () => {
      const mockTrades = Array.from({ length: 5 }, (_, i) => ({
        hash: `hash${i}`,
        ledger_index: 100 + i,
        timestamp: 1000 + i,
        dex_trades: [
          {
            from: `rFrom${i}`,
            to: `rTo${i}`,
            amount_in: { currency: 'USD', issuer: 'rIssuer', value: '100' },
            amount_out: { currency: 'XRP', issuer: '', value: '50' },
          },
        ],
      }))

      mockGetDexTrades.mockResolvedValue({
        results: mockTrades,
        next_cursor: null,
      })

      await dexTradesPaginationService.getDexTradesPage('USD.rIssuer', 1)
      const count =
        dexTradesPaginationService.getCachedTradesCount('USD.rIssuer')

      expect(count).toBe(5)
    })
  })

  describe('edge cases', () => {
    it('handles invalid page size gracefully', async () => {
      mockGetDexTrades.mockResolvedValue({
        results: [],
        next_cursor: null,
      })

      const result = await dexTradesPaginationService.getDexTradesPage(
        'USD.rIssuer',
        1,
        0,
      )

      expect(result).toBeDefined()
    })

    it('handles negative page number', async () => {
      mockGetDexTrades.mockResolvedValue({
        results: [],
        next_cursor: null,
      })

      const result = await dexTradesPaginationService.getDexTradesPage(
        'USD.rIssuer',
        -1,
      )

      expect(result).toBeDefined()
    })

    it('handles empty tokenId', async () => {
      mockGetDexTrades.mockResolvedValue({
        results: [],
        next_cursor: null,
      })

      const result = await dexTradesPaginationService.getDexTradesPage('', 1)

      expect(result).toBeDefined()
    })
  })
})
