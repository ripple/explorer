import axios from 'axios'
import getTokenHolders, { TokenHoldersData } from '../../api/holders'

jest.mock('axios')

describe('Token Holders API', () => {
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

  describe('getTokenHolders', () => {
    const mockHoldersData: TokenHoldersData = {
      totalSupply: 1000000,
      totalHolders: 100,
      holders: [
        { account: 'rHolder1', balance: 100000, percent: 10 },
        { account: 'rHolder2', balance: 50000, percent: 5 },
        { account: 'rHolder3', balance: 25000, percent: 2.5 },
      ],
    }

    it('should fetch token holders successfully with default parameters', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: mockHoldersData })

      const result = await getTokenHolders('USD', 'rIssuer123')

      expect(result).toEqual(mockHoldersData)
      expect(mockAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('USD:rIssuer123'),
      )
      expect(mockAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('limit=100'),
      )
      expect(mockAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('offset=0'),
      )
    })

    it('should fetch token holders with custom limit and offset', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: mockHoldersData })

      const result = await getTokenHolders('USD', 'rIssuer123', 50, 100)

      expect(result).toEqual(mockHoldersData)
      expect(mockAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('limit=50'),
      )
      expect(mockAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('offset=100'),
      )
    })

    it('should construct correct URL with currency and issuer', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: mockHoldersData })

      await getTokenHolders('EUR', 'rEURIssuer', 20, 0)

      expect(mockAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('EUR:rEURIssuer'),
      )
    })

    it('should handle empty holders list', async () => {
      const emptyData: TokenHoldersData = {
        totalSupply: 0,
        totalHolders: 0,
        holders: [],
      }

      mockAxios.get.mockResolvedValueOnce({ data: emptyData })

      const result = await getTokenHolders('TEST', 'rTest')

      expect(result.holders).toEqual([])
      expect(result.totalHolders).toBe(0)
    })

    it('should handle large holder lists', async () => {
      const largeHoldersList: TokenHoldersData = {
        totalSupply: 10000000,
        totalHolders: 1000,
        holders: Array.from({ length: 100 }, (_, i) => ({
          account: `rHolder${i}`,
          balance: 100000,
          percent: 1,
        })),
      }

      mockAxios.get.mockResolvedValueOnce({ data: largeHoldersList })

      const result = await getTokenHolders('LARGE', 'rLarge', 100, 0)

      expect(result.holders.length).toBe(100)
      expect(result.totalHolders).toBe(1000)
    })

    it('should throw error on API failure', async () => {
      const error = new Error('Network error')
      mockAxios.get.mockRejectedValueOnce(error)

      await expect(getTokenHolders('USD', 'rIssuer123')).rejects.toThrow(
        'Network error',
      )
    })

    it('should throw error on 404 response', async () => {
      const error = new Error('Not found')
      mockAxios.get.mockRejectedValueOnce(error)

      await expect(getTokenHolders('INVALID', 'rInvalid')).rejects.toThrow()
    })

    it('should handle pagination correctly', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: mockHoldersData })
      mockAxios.get.mockResolvedValueOnce({ data: mockHoldersData })

      // First page
      await getTokenHolders('USD', 'rIssuer123', 20, 0)
      expect(mockAxios.get).toHaveBeenLastCalledWith(
        expect.stringContaining('offset=0'),
      )

      // Second page
      await getTokenHolders('USD', 'rIssuer123', 20, 20)
      expect(mockAxios.get).toHaveBeenLastCalledWith(
        expect.stringContaining('offset=20'),
      )
    })

    it('should handle holders with different percentages', async () => {
      const diverseHolders: TokenHoldersData = {
        totalSupply: 1000000,
        totalHolders: 5,
        holders: [
          { account: 'rHolder1', balance: 500000, percent: 50 },
          { account: 'rHolder2', balance: 300000, percent: 30 },
          { account: 'rHolder3', balance: 150000, percent: 15 },
          { account: 'rHolder4', balance: 40000, percent: 4 },
          { account: 'rHolder5', balance: 10000, percent: 1 },
        ],
      }

      mockAxios.get.mockResolvedValueOnce({ data: diverseHolders })

      const result = await getTokenHolders('USD', 'rIssuer123')

      expect(result.holders[0].percent).toBe(50)
      expect(result.holders[4].percent).toBe(1)
    })

    it('should handle very small balances', async () => {
      const smallBalances: TokenHoldersData = {
        totalSupply: 1000000,
        totalHolders: 3,
        holders: [
          { account: 'rHolder1', balance: 0.0001, percent: 0.00001 },
          { account: 'rHolder2', balance: 0.00001, percent: 0.000001 },
          { account: 'rHolder3', balance: 0.000001, percent: 0.0000001 },
        ],
      }

      mockAxios.get.mockResolvedValueOnce({ data: smallBalances })

      const result = await getTokenHolders('SMALL', 'rSmall')

      expect(result.holders[0].balance).toBe(0.0001)
      expect(result.totalSupply).toBe(1000000)
    })

    it('should handle very large balances', async () => {
      const largeBalances: TokenHoldersData = {
        totalSupply: 999999999999,
        totalHolders: 2,
        holders: [{ account: 'rHolder1', balance: 999999999999, percent: 100 }],
      }

      mockAxios.get.mockResolvedValueOnce({ data: largeBalances })

      const result = await getTokenHolders('LARGE', 'rLarge')

      expect(result.totalSupply).toBe(999999999999)
      expect(result.holders[0].balance).toBe(999999999999)
    })

    it('should handle timeout errors', async () => {
      const timeoutError = new Error('timeout of 5000ms exceeded')
      mockAxios.get.mockRejectedValueOnce(timeoutError)

      await expect(getTokenHolders('USD', 'rIssuer123')).rejects.toThrow(
        'timeout',
      )
    })

    it('should handle server errors', async () => {
      const serverError = new Error('500 Internal Server Error')
      mockAxios.get.mockRejectedValueOnce(serverError)

      await expect(getTokenHolders('USD', 'rIssuer123')).rejects.toThrow()
    })

    it('should handle zero offset correctly', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: mockHoldersData })

      await getTokenHolders('USD', 'rIssuer123', 100, 0)

      expect(mockAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('offset=0'),
      )
    })

    it('should handle large offset values', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: mockHoldersData })

      await getTokenHolders('USD', 'rIssuer123', 20, 10000)

      expect(mockAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('offset=10000'),
      )
    })
  })
})
