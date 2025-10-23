import { transfersPaginationService } from '../../services/transfersPagination'

import { getTransfers } from '../../api/tokenTx'

jest.mock('../../api/tokenTx', () => ({
  getTransfers: jest.fn(),
}))

const mockGetTransfers = getTransfers as jest.Mock

describe('TransfersPaginationService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    transfersPaginationService.clearCache()
  })

  describe('getTransfersPage', () => {
    it('returns empty transfers on first call with no data', async () => {
      mockGetTransfers.mockResolvedValue({
        results: [],
        next_cursor: null,
      })

      const result = await transfersPaginationService.getTransfersPage(
        'USD',
        'rIssuer',
        1,
      )

      expect(result.transfers).toEqual([])
      expect(result.totalTransfers).toBe(0)
      expect(result.hasMore).toBe(false)
    })

    it('fetches and returns transfers on first page', async () => {
      const mockTransfers = [
        {
          hash: 'hash1',
          ledger_index: 100,
          timestamp: 1000,
          type: 'Payment',
          account: 'rFrom1',
          destination: 'rTo1',
          amount: { currency: 'USD', issuer: 'rIssuer', value: '100' },
        },
      ]

      mockGetTransfers.mockResolvedValue({
        results: mockTransfers,
        next_cursor: 'cursor1',
      })

      const result = await transfersPaginationService.getTransfersPage(
        'USD',
        'rIssuer',
        1,
      )

      expect(result.transfers.length).toBe(1)
      expect(result.totalTransfers).toBe(1)
      expect(result.hasMore).toBe(false)
    })

    it('uses default page size when not provided', async () => {
      mockGetTransfers.mockResolvedValue({
        results: [],
        next_cursor: null,
      })

      await transfersPaginationService.getTransfersPage('USD', 'rIssuer', 1)

      expect(mockGetTransfers).toHaveBeenCalledWith(
        'USD',
        'rIssuer',
        200,
        undefined,
        'next',
        undefined,
        undefined,
      )
    })

    it('uses custom page size when provided', async () => {
      mockGetTransfers.mockResolvedValue({
        results: [],
        next_cursor: null,
      })

      await transfersPaginationService.getTransfersPage('USD', 'rIssuer', 1, 20)

      expect(mockGetTransfers).toHaveBeenCalled()
    })

    it('handles multiple pages correctly', async () => {
      const mockTransfers = Array.from({ length: 200 }, (_, i) => ({
        hash: `hash${i}`,
        ledger_index: 100 + i,
        timestamp: 1000 + i,
        type: 'Payment',
        account: `rFrom${i}`,
        destination: `rTo${i}`,
        amount: { currency: 'USD', issuer: 'rIssuer', value: '100' },
      }))

      mockGetTransfers.mockResolvedValue({
        results: mockTransfers,
        next_cursor: 'cursor1',
      })

      const result1 = await transfersPaginationService.getTransfersPage(
        'USD',
        'rIssuer',
        1,
        10,
      )

      expect(result1.transfers.length).toBe(10)
      expect(result1.hasMore).toBe(true)
    })

    it('caches transfers between calls', async () => {
      const mockTransfers = [
        {
          hash: 'hash1',
          ledger_index: 100,
          timestamp: 1000,
          type: 'Payment',
          account: 'rFrom1',
          destination: 'rTo1',
          amount: { currency: 'USD', issuer: 'rIssuer', value: '100' },
        },
      ]

      mockGetTransfers.mockResolvedValue({
        results: mockTransfers,
        next_cursor: null,
      })

      await transfersPaginationService.getTransfersPage('USD', 'rIssuer', 1)
      const callCount1 = mockGetTransfers.mock.calls.length

      await transfersPaginationService.getTransfersPage('USD', 'rIssuer', 1)
      const callCount2 = mockGetTransfers.mock.calls.length

      // Should not fetch again for same page
      expect(callCount2).toBe(callCount1)
    })

    it('handles sorting parameters', async () => {
      mockGetTransfers.mockResolvedValue({
        results: [],
        next_cursor: null,
      })

      await transfersPaginationService.getTransfersPage(
        'USD',
        'rIssuer',
        1,
        10,
        'timestamp',
        'asc',
      )

      expect(mockGetTransfers).toHaveBeenCalledWith(
        'USD',
        'rIssuer',
        200,
        undefined,
        'next',
        'timestamp',
        'asc',
      )
    })

    it('returns correct hasMore flag', async () => {
      const mockTransfers = Array.from({ length: 200 }, (_, i) => ({
        hash: `hash${i}`,
        ledger_index: 100 + i,
        timestamp: 1000 + i,
        type: 'Payment',
        account: `rFrom${i}`,
        destination: `rTo${i}`,
        amount: { currency: 'USD', issuer: 'rIssuer', value: '100' },
      }))

      mockGetTransfers.mockResolvedValue({
        results: mockTransfers,
        next_cursor: 'cursor1',
      })

      const result = await transfersPaginationService.getTransfersPage(
        'USD',
        'rIssuer',
        1,
        10,
      )

      expect(result.hasMore).toBe(true)
    })
  })

  describe('clearCache', () => {
    it('clears cache for specific currency and issuer', async () => {
      mockGetTransfers.mockResolvedValue({
        results: [],
        next_cursor: null,
      })

      await transfersPaginationService.getTransfersPage('USD', 'rIssuer', 1)
      transfersPaginationService.clearCache('USD', 'rIssuer')

      const count1 = mockGetTransfers.mock.calls.length
      await transfersPaginationService.getTransfersPage('USD', 'rIssuer', 1)
      const count2 = mockGetTransfers.mock.calls.length

      expect(count2).toBeGreaterThan(count1)
    })

    it('clears all caches when no parameters provided', async () => {
      mockGetTransfers.mockResolvedValue({
        results: [],
        next_cursor: null,
      })

      await transfersPaginationService.getTransfersPage('USD', 'rIssuer', 1)
      transfersPaginationService.clearCache()

      const count1 = mockGetTransfers.mock.calls.length
      await transfersPaginationService.getTransfersPage('USD', 'rIssuer', 1)
      const count2 = mockGetTransfers.mock.calls.length

      expect(count2).toBeGreaterThan(count1)
    })
  })

  describe('getCachedTransfersCount', () => {
    it('returns 0 for uncached currency', () => {
      const count = transfersPaginationService.getCachedTransfersCount(
        'USD',
        'rIssuer',
      )
      expect(count).toBe(0)
    })

    it('returns correct count after fetching', async () => {
      const mockTransfers = Array.from({ length: 5 }, (_, i) => ({
        hash: `hash${i}`,
        ledger_index: 100 + i,
        timestamp: 1000 + i,
        type: 'Payment',
        account: `rFrom${i}`,
        destination: `rTo${i}`,
        amount: { currency: 'USD', issuer: 'rIssuer', value: '100' },
      }))

      mockGetTransfers.mockResolvedValue({
        results: mockTransfers,
        next_cursor: null,
      })

      await transfersPaginationService.getTransfersPage('USD', 'rIssuer', 1)
      const count = transfersPaginationService.getCachedTransfersCount(
        'USD',
        'rIssuer',
      )

      expect(count).toBe(5)
    })

    it('returns correct count with sorting parameters', async () => {
      const mockTransfers = Array.from({ length: 5 }, (_, i) => ({
        hash: `hash${i}`,
        ledger_index: 100 + i,
        timestamp: 1000 + i,
        type: 'Payment',
        account: `rFrom${i}`,
        destination: `rTo${i}`,
        amount: { currency: 'USD', issuer: 'rIssuer', value: '100' },
      }))

      mockGetTransfers.mockResolvedValue({
        results: mockTransfers,
        next_cursor: null,
      })

      await transfersPaginationService.getTransfersPage(
        'USD',
        'rIssuer',
        1,
        10,
        'timestamp',
        'asc',
      )
      const count = transfersPaginationService.getCachedTransfersCount(
        'USD',
        'rIssuer',
        'timestamp',
        'asc',
      )

      expect(count).toBe(5)
    })
  })

  describe('edge cases', () => {
    it('handles invalid page size gracefully', async () => {
      mockGetTransfers.mockResolvedValue({
        results: [],
        next_cursor: null,
      })

      const result = await transfersPaginationService.getTransfersPage(
        'USD',
        'rIssuer',
        1,
        0,
      )

      expect(result).toBeDefined()
    })

    it('handles negative page number', async () => {
      mockGetTransfers.mockResolvedValue({
        results: [],
        next_cursor: null,
      })

      const result = await transfersPaginationService.getTransfersPage(
        'USD',
        'rIssuer',
        -1,
      )

      expect(result).toBeDefined()
    })

    it('handles empty currency', async () => {
      mockGetTransfers.mockResolvedValue({
        results: [],
        next_cursor: null,
      })

      const result = await transfersPaginationService.getTransfersPage(
        '',
        'rIssuer',
        1,
      )

      expect(result).toBeDefined()
    })

    it('handles large page numbers', async () => {
      mockGetTransfers.mockResolvedValue({
        results: [],
        next_cursor: null,
      })

      const result = await transfersPaginationService.getTransfersPage(
        'USD',
        'rIssuer',
        1000,
      )

      expect(result).toBeDefined()
    })
  })
})
