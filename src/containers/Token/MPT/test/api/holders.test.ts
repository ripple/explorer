import { getMPTHolders } from '../../../../../rippled/lib/rippled'
import { fetchAllMPTHolders } from '../../api/holders'

jest.mock('../../../../../rippled/lib/rippled')
jest.mock('../../../../shared/utils', () => ({
  convertScaledPrice: (value: bigint, scale: number) => {
    const str = value.toString()
    if (scale === 0) return str
    const paddedStr = str.padStart(scale + 1, '0')
    const intPart = paddedStr.slice(0, -scale) || '0'
    const decPart = paddedStr.slice(-scale)
    return `${intPart}.${decPart}`
  },
}))

const mockGetMPTHolders = jest.mocked(getMPTHolders)

describe('MPT Holders API', () => {
  const mockSocket = {}
  const tokenId = '00000004A407AF5856CCF3C42619DAA925813FC955C72983'

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('fetchAllMPTHolders', () => {
    it('should fetch and format holders correctly', async () => {
      mockGetMPTHolders.mockResolvedValueOnce({
        mptokens: [
          {
            account: 'rAccount1',
            flags: 0,
            mpt_amount: '5000000',
            mptoken_index: 'index1',
          },
          {
            account: 'rAccount2',
            flags: 0,
            mpt_amount: '3000000',
            mptoken_index: 'index2',
          },
        ],
        marker: undefined,
      })

      const result = await fetchAllMPTHolders(
        mockSocket,
        tokenId,
        '10000000',
        6,
      )

      expect(result.totalHolders).toBe(2)
      expect(result.holders).toHaveLength(2)
      expect(result.holders[0].rank).toBe(1)
      expect(result.holders[0].account).toBe('rAccount1')
      expect(result.holders[0].balance).toBe('5.000000')
      expect(result.holders[0].percent).toBe(50)
      expect(result.holders[1].rank).toBe(2)
      expect(result.holders[1].account).toBe('rAccount2')
      expect(result.holders[1].percent).toBe(30)
    })

    it('should handle pagination with marker', async () => {
      mockGetMPTHolders
        .mockResolvedValueOnce({
          mptokens: [
            {
              account: 'rAccount1',
              flags: 0,
              mpt_amount: '1000',
              mptoken_index: 'index1',
            },
          ],
          marker: 'page2',
        })
        .mockResolvedValueOnce({
          mptokens: [
            {
              account: 'rAccount2',
              flags: 0,
              mpt_amount: '2000',
              mptoken_index: 'index2',
            },
          ],
          marker: undefined,
        })

      const result = await fetchAllMPTHolders(mockSocket, tokenId, '3000', 0)

      expect(mockGetMPTHolders).toHaveBeenCalledTimes(2)
      expect(result.totalHolders).toBe(2)
      // Sorted by balance descending
      expect(result.holders[0].account).toBe('rAccount2')
      expect(result.holders[1].account).toBe('rAccount1')
    })

    it('should filter out zero balance holders', async () => {
      mockGetMPTHolders.mockResolvedValueOnce({
        mptokens: [
          {
            account: 'rAccount1',
            flags: 0,
            mpt_amount: '1000',
            mptoken_index: 'index1',
          },
          {
            account: 'rAccount2',
            flags: 0,
            mpt_amount: '0',
            mptoken_index: 'index2',
          },
        ],
        marker: undefined,
      })

      const result = await fetchAllMPTHolders(mockSocket, tokenId, '1000', 0)

      expect(result.totalHolders).toBe(1)
      expect(result.holders[0].account).toBe('rAccount1')
    })

    it('should handle empty response', async () => {
      mockGetMPTHolders.mockResolvedValueOnce({
        mptokens: [],
        marker: undefined,
      })

      const result = await fetchAllMPTHolders(mockSocket, tokenId, '0', 0)

      expect(result.totalHolders).toBe(0)
      expect(result.holders).toEqual([])
    })

    it('should handle zero outstanding amount', async () => {
      mockGetMPTHolders.mockResolvedValueOnce({
        mptokens: [
          {
            account: 'rAccount1',
            flags: 0,
            mpt_amount: '1000',
            mptoken_index: 'index1',
          },
        ],
        marker: undefined,
      })

      const result = await fetchAllMPTHolders(mockSocket, tokenId, '0', 0)

      expect(result.holders[0].percent).toBe(0)
    })
  })
})
