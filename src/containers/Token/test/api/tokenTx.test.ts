import axios from 'axios'
import { getDexTrades, getTransfers } from '../../api/tokenTx'

jest.mock('axios')

describe('Token Transactions API', () => {
  const mockAxios = axios as jest.Mocked<typeof axios>

  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getDexTrades', () => {
    const mockDexTradesResponse = {
      transactions: [
        {
          hash: 'tx1',
          type: 'dex-trade',
          timestamp: 1234567890,
        },
        {
          hash: 'tx2',
          type: 'dex-trade',
          timestamp: 1234567891,
        },
      ],
      search_after: ['value1', 'value2'],
    }

    it('should fetch dex trades with default parameters', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: mockDexTradesResponse })

      const result = await getDexTrades('USD', 'rIssuer123')

      expect(result).toEqual(mockDexTradesResponse)
      expect(mockAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('token=USD.rIssuer123'),
      )
      expect(mockAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('transactionType=dex-trade'),
      )
      expect(mockAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('size=10'),
      )
    })

    it('should fetch dex trades with custom size', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: mockDexTradesResponse })

      await getDexTrades('USD', 'rIssuer123', 50)

      expect(mockAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('size=50'),
      )
    })

    it('should include search_after parameter when provided', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: mockDexTradesResponse })

      const searchAfter = ['value1', 'value2']
      await getDexTrades('USD', 'rIssuer123', 10, searchAfter)

      expect(mockAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('search_after='),
      )
    })

    it('should include direction parameter when provided', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: mockDexTradesResponse })

      await getDexTrades('USD', 'rIssuer123', 10, undefined, 'prev')

      expect(mockAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('direction=prev'),
      )
    })

    it('should include sort parameters when provided', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: mockDexTradesResponse })

      await getDexTrades(
        'USD',
        'rIssuer123',
        10,
        undefined,
        undefined,
        'timestamp',
        'desc',
      )

      expect(mockAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('sort_field=timestamp'),
      )
      expect(mockAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('sort_order=desc'),
      )
    })

    it('should throw error on API failure', async () => {
      const error = new Error('Network error')
      mockAxios.get.mockRejectedValueOnce(error)

      await expect(getDexTrades('USD', 'rIssuer123')).rejects.toThrow(
        'Network error',
      )
    })

    it('should handle empty transaction list', async () => {
      const emptyResponse = {
        transactions: [],
        search_after: null,
      }

      mockAxios.get.mockResolvedValueOnce({ data: emptyResponse })

      const result = await getDexTrades('USD', 'rIssuer123')

      expect(result.transactions).toEqual([])
    })
  })

  describe('getTransfers', () => {
    const mockTransfersResponse = {
      transactions: [
        {
          hash: 'tx1',
          type: 'transfer',
          timestamp: 1234567890,
        },
        {
          hash: 'tx2',
          type: 'transfer',
          timestamp: 1234567891,
        },
      ],
      search_after: ['value1', 'value2'],
    }

    it('should fetch transfers with default parameters', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: mockTransfersResponse })

      const result = await getTransfers('USD', 'rIssuer123')

      expect(result).toEqual(mockTransfersResponse)
      expect(mockAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('token=USD.rIssuer123'),
      )
      expect(mockAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('transactionType=transfer'),
      )
      expect(mockAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('size=10'),
      )
    })

    it('should fetch transfers with custom size', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: mockTransfersResponse })

      await getTransfers('USD', 'rIssuer123', 25)

      expect(mockAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('size=25'),
      )
    })

    it('should include all optional parameters', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: mockTransfersResponse })

      const searchAfter = ['val1', 'val2']
      await getTransfers(
        'EUR',
        'rEUR',
        20,
        searchAfter,
        'next',
        'amount',
        'asc',
      )

      expect(mockAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('token=EUR.rEUR'),
      )
      expect(mockAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('transactionType=transfer'),
      )
      expect(mockAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('size=20'),
      )
      expect(mockAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('direction=next'),
      )
      expect(mockAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('sort_field=amount'),
      )
      expect(mockAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('sort_order=asc'),
      )
    })

    it('should throw error on API failure', async () => {
      const error = new Error('Network error')
      mockAxios.get.mockRejectedValueOnce(error)

      await expect(getTransfers('USD', 'rIssuer123')).rejects.toThrow(
        'Network error',
      )
    })

    it('should handle empty transaction list', async () => {
      const emptyResponse = {
        transactions: [],
        search_after: null,
      }

      mockAxios.get.mockResolvedValueOnce({ data: emptyResponse })

      const result = await getTransfers('USD', 'rIssuer123')

      expect(result.transactions).toEqual([])
    })

    it('should handle timeout errors for dex trades', async () => {
      const timeoutError = new Error('timeout of 5000ms exceeded')
      mockAxios.get.mockRejectedValueOnce(timeoutError)

      await expect(getDexTrades('USD', 'rIssuer123')).rejects.toThrow('timeout')
    })

    it('should handle timeout errors for transfers', async () => {
      const timeoutError = new Error('timeout of 5000ms exceeded')
      mockAxios.get.mockRejectedValueOnce(timeoutError)

      await expect(getTransfers('USD', 'rIssuer123')).rejects.toThrow('timeout')
    })

    it('should handle server errors for dex trades', async () => {
      const serverError = new Error('500 Internal Server Error')
      mockAxios.get.mockRejectedValueOnce(serverError)

      await expect(getDexTrades('USD', 'rIssuer123')).rejects.toThrow()
    })

    it('should handle server errors for transfers', async () => {
      const serverError = new Error('500 Internal Server Error')
      mockAxios.get.mockRejectedValueOnce(serverError)

      await expect(getTransfers('USD', 'rIssuer123')).rejects.toThrow()
    })

    it('should handle large transaction lists', async () => {
      const largeResponse = {
        transactions: Array.from({ length: 1000 }, (_, i) => ({
          hash: `tx${i}`,
          type: 'transfer',
          timestamp: 1234567890 + i,
        })),
        search_after: ['value1', 'value2'],
      }

      mockAxios.get.mockResolvedValueOnce({ data: largeResponse })

      const result = await getTransfers('USD', 'rIssuer123')

      expect(result.transactions.length).toBe(1000)
    })

    it('should handle all optional parameters together', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: mockTransfersResponse })

      const searchAfter = ['val1', 'val2']
      await getTransfers(
        'EUR',
        'rEUR',
        50,
        searchAfter,
        'prev',
        'amount',
        'asc',
      )

      expect(mockAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('token=EUR.rEUR'),
      )
      expect(mockAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('size=50'),
      )
      expect(mockAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('direction=prev'),
      )
      expect(mockAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('sort_field=amount'),
      )
      expect(mockAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('sort_order=asc'),
      )
    })

    it('should handle null search_after parameter', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: mockTransfersResponse })

      await getTransfers('USD', 'rIssuer123', 10, null)

      expect(mockAxios.get).toHaveBeenCalled()
    })

    it('should handle undefined optional parameters', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: mockTransfersResponse })

      await getTransfers(
        'USD',
        'rIssuer123',
        10,
        undefined,
        undefined,
        undefined,
        undefined,
      )

      expect(mockAxios.get).toHaveBeenCalled()
    })
  })
})
