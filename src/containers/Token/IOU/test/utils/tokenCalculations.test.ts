import {
  calculateCirculatingSupply,
  formatCirculatingSupply,
} from '../../utils/tokenCalculations'
import { TokenHoldersData } from '../../api/holders'
import { LOSToken } from '../../../../shared/losTypes'

describe('tokenCalculations', () => {
  describe('calculateCirculatingSupply', () => {
    const mockTokenData: LOSToken = {
      currency: 'USD',
      issuer_account: 'rIssuer',
      trustlines: 100,
      index: 0,
    }

    it('returns circ_supply from tokenData if available', () => {
      const tokenData = {
        ...mockTokenData,
        circ_supply: '1000000',
      }
      const result = calculateCirculatingSupply(undefined, tokenData)
      expect(result).toBe(1000000)
    })

    it('returns supply from tokenData when circ_supply is not available', () => {
      const tokenData = {
        ...mockTokenData,
        supply: '5000000',
      }
      const result = calculateCirculatingSupply(undefined, tokenData)
      expect(result).toBe(5000000)
    })

    it('returns totalSupply from holdersData when tokenData supply is not available', () => {
      const holdersData: TokenHoldersData = {
        totalSupply: 3000000,
        totalHolders: 100,
        holders: [],
      }
      const tokenData = {
        ...mockTokenData,
      }
      const result = calculateCirculatingSupply(holdersData, tokenData)
      expect(result).toBe(3000000)
    })

    it('returns 0 when no supply data is available', () => {
      const tokenData = {
        ...mockTokenData,
      }
      const result = calculateCirculatingSupply(undefined, tokenData)
      expect(result).toBe(0)
    })

    it('subtracts large holders (>= 20%) for non-stablecoin tokens', () => {
      const holdersData: TokenHoldersData = {
        totalSupply: 1000000,
        totalHolders: 5,
        holders: [
          { account: 'rHolder1', balance: 300000, percent: 30 },
          { account: 'rHolder2', balance: 200000, percent: 20 },
          { account: 'rHolder3', balance: 100000, percent: 10 },
        ],
      }
      const tokenData = {
        ...mockTokenData,
        supply: '1000000',
        asset_subclass: 'token',
      }
      const result = calculateCirculatingSupply(holdersData, tokenData)
      // 1000000 - 300000 (30%) - 200000 (20%) = 500000
      expect(result).toBe(500000)
    })

    it('does not subtract large holders for stablecoin tokens', () => {
      const holdersData: TokenHoldersData = {
        totalSupply: 1000000,
        totalHolders: 5,
        holders: [
          { account: 'rHolder1', balance: 300000, percent: 30 },
          { account: 'rHolder2', balance: 200000, percent: 20 },
          { account: 'rHolder3', balance: 100000, percent: 10 },
        ],
      }
      const tokenData = {
        ...mockTokenData,
        supply: '1000000',
        asset_subclass: 'stablecoin',
      }
      const result = calculateCirculatingSupply(holdersData, tokenData)
      // For stablecoins, no subtraction: 1000000
      expect(result).toBe(1000000)
    })

    it('handles holders with exactly 20% threshold', () => {
      const holdersData: TokenHoldersData = {
        totalSupply: 1000000,
        totalHolders: 5,
        holders: [
          { account: 'rHolder1', balance: 200000, percent: 20 },
          { account: 'rHolder2', balance: 100000, percent: 10 },
        ],
      }
      const tokenData = {
        ...mockTokenData,
        supply: '1000000',
        asset_subclass: 'token',
      }
      const result = calculateCirculatingSupply(holdersData, tokenData)
      // 1000000 - 200000 (20%) = 800000
      expect(result).toBe(800000)
    })

    it('handles holders with less than 20% threshold', () => {
      const holdersData: TokenHoldersData = {
        totalSupply: 1000000,
        totalHolders: 5,
        holders: [
          { account: 'rHolder1', balance: 190000, percent: 19 },
          { account: 'rHolder2', balance: 100000, percent: 10 },
        ],
      }
      const tokenData = {
        ...mockTokenData,
        supply: '1000000',
        asset_subclass: 'token',
      }
      const result = calculateCirculatingSupply(holdersData, tokenData)
      // No subtraction: 1000000
      expect(result).toBe(1000000)
    })

    it('handles empty holders array', () => {
      const holdersData: TokenHoldersData = {
        totalSupply: 1000000,
        totalHolders: 0,
        holders: [],
      }
      const tokenData = {
        ...mockTokenData,
        supply: '1000000',
        asset_subclass: 'token',
      }
      const result = calculateCirculatingSupply(holdersData, tokenData)
      expect(result).toBe(1000000)
    })

    it('handles multiple large holders', () => {
      const holdersData: TokenHoldersData = {
        totalSupply: 1000000,
        totalHolders: 10,
        holders: [
          { account: 'rHolder1', balance: 250000, percent: 25 },
          { account: 'rHolder2', balance: 250000, percent: 25 },
          { account: 'rHolder3', balance: 250000, percent: 25 },
          { account: 'rHolder4', balance: 250000, percent: 25 },
        ],
      }
      const tokenData = {
        ...mockTokenData,
        supply: '1000000',
        asset_subclass: 'token',
      }
      const result = calculateCirculatingSupply(holdersData, tokenData)
      // 1000000 - (250000 * 4) = 0
      expect(result).toBe(0)
    })

    it('prioritizes circ_supply over supply', () => {
      const holdersData: TokenHoldersData = {
        totalSupply: 5000000,
        totalHolders: 100,
        holders: [],
      }
      const tokenData = {
        ...mockTokenData,
        circ_supply: '2000000',
        supply: '3000000',
      }
      const result = calculateCirculatingSupply(holdersData, tokenData)
      expect(result).toBe(2000000)
    })
  })

  describe('formatCirculatingSupply', () => {
    it('formats small numbers with full precision', () => {
      const result = formatCirculatingSupply(100)
      expect(result).toBe('100')
    })

    it('formats large numbers with abbreviation', () => {
      const result = formatCirculatingSupply(1000000)
      expect(result).toMatch(/1\.0M|1M/)
    })

    it('formats very large numbers with abbreviation', () => {
      const result = formatCirculatingSupply(1000000000)
      expect(result).toMatch(/1\.0B|1B/)
    })

    it('formats zero', () => {
      const result = formatCirculatingSupply(0)
      expect(result).toBe('0')
    })

    it('formats decimal numbers', () => {
      const result = formatCirculatingSupply(1234.5678)
      expect(result).toBeDefined()
    })

    it('handles very small numbers', () => {
      const result = formatCirculatingSupply(0.0001)
      expect(result).toBeDefined()
    })
  })
})
