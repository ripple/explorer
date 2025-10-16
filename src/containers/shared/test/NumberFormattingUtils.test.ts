import {
  formatUsdValue,
  formatTokenBalance,
  calculateFormattedUsdBalance,
} from '../NumberFormattingUtils'

describe('NumberFormattingUtils', () => {
  const lang = 'en-US'

  describe('formatUsdValue', () => {
    it('returns "--" for zero value', () => {
      expect(formatUsdValue(0, lang)).toBe('--')
    })

    it('formats regular USD value (>= $1) with 2 decimals', () => {
      expect(formatUsdValue(1, lang)).toBe('$1.00')
      expect(formatUsdValue(100, lang)).toBe('$100.00')
      expect(formatUsdValue(23.565, lang)).toBe('$23.57')
      expect(formatUsdValue(5678.9, lang)).toBe('$5,678.90')
    })

    it('formats small USD value (>= $0.0001, < $1) with 4 decimals', () => {
      expect(formatUsdValue(0.0001, lang)).toBe('$0.0001')
      expect(formatUsdValue(0.00014, lang)).toBe('$0.0001')
      expect(formatUsdValue(0.00015, lang)).toBe('$0.0002')
      expect(formatUsdValue(0.25, lang)).toBe('$0.25')
      expect(formatUsdValue(0.5, lang)).toBe('$0.50')
      expect(formatUsdValue(0.9999, lang)).toBe('$0.9999')
      expect(formatUsdValue(0.99995, lang)).toBe('$1.00')
    })

    it('formats extra small USD value (< $0.0001) with up to 10 decimals', () => {
      expect(formatUsdValue(0.00000000051, lang)).toBe('$0.0000000005')
      expect(formatUsdValue(0.000001, lang)).toBe('$0.000001')
      expect(formatUsdValue(0.0000051, lang)).toBe('$0.0000051')
      expect(formatUsdValue(0.000014, lang)).toBe('$0.000014')
      expect(formatUsdValue(0.00005, lang)).toBe('$0.00005')
    })

    it('handles negative values', () => {
      expect(formatUsdValue(-100, lang)).toBe('-$100.00')
      expect(formatUsdValue(-0.0001, lang)).toBe('-$0.0001')
      expect(formatUsdValue(-200, lang)).toBe('-$200.00')
      expect(formatUsdValue(-0.0005, lang)).toBe('-$0.0005')
    })
  })

  describe('formatTokenBalance', () => {
    it('formats large token balance (> 999) with 2 decimals', () => {
      expect(formatTokenBalance(1000, lang)).toBe('1,000')
      expect(formatTokenBalance(5000, lang)).toBe('5,000')
      expect(formatTokenBalance(1234567.891, lang)).toBe('1,234,567.89')
    })

    it('formats small token balance (<= 999) with 4 decimals', () => {
      expect(formatTokenBalance(0, lang)).toBe('0')
      expect(formatTokenBalance(1, lang)).toBe('1')
      expect(formatTokenBalance(100, lang)).toBe('100')
      expect(formatTokenBalance(999, lang)).toBe('999')
      expect(formatTokenBalance(0.1234, lang)).toBe('0.1234')
      expect(formatTokenBalance(500.56784, lang)).toBe('500.5678')
      expect(formatTokenBalance(500.56785, lang)).toBe('500.5679')
    })

    it('handles negative token balances', () => {
      expect(formatTokenBalance(-1000, lang)).toBe('-1,000')
      expect(formatTokenBalance(-100, lang)).toBe('-100')
    })
  })

  describe('calculateFormattedUsdBalance', () => {
    it('returns all "--" when price is zero', () => {
      const result = calculateFormattedUsdBalance(1000, 0, lang)
      expect(result).toEqual({
        formattedUsdPrice: '--',
        formattedBalance: '1,000', // Balance is formatted even when price is zero
        formattedBalanceUsd: '--',
      })
    })

    it('calculates formatted USD balance correctly for regular values', () => {
      const result = calculateFormattedUsdBalance(100, 50, lang)
      expect(result).toEqual({
        formattedUsdPrice: '$50.00',
        formattedBalance: '100',
        formattedBalanceUsd: '$5,000.00',
      })
    })

    it('calculates formatted USD balance correctly for small token balance', () => {
      const result = calculateFormattedUsdBalance(0.5, 100, lang)
      expect(result).toEqual({
        formattedUsdPrice: '$100.00',
        formattedBalance: '0.5',
        formattedBalanceUsd: '$50.00',
      })
    })

    it('calculates formatted USD balance correctly for small price', () => {
      const result = calculateFormattedUsdBalance(1000, 0.0005, lang)
      expect(result).toEqual({
        formattedUsdPrice: '$0.0005',
        formattedBalance: '1,000',
        formattedBalanceUsd: '$0.50',
      })
    })

    it('calculates formatted USD balance correctly for extra small price', () => {
      const result = calculateFormattedUsdBalance(10000, 0.00001, lang)
      expect(result).toEqual({
        formattedUsdPrice: '$0.00001',
        formattedBalance: '10,000',
        formattedBalanceUsd: '$0.10',
      })
    })

    it('handles calculations resulting in small USD balances', () => {
      const result = calculateFormattedUsdBalance(10, 0.05, lang)
      expect(result).toEqual({
        formattedUsdPrice: '$0.05',
        formattedBalance: '10',
        formattedBalanceUsd: '$0.50',
      })
    })

    it('handles calculations with decimal token balances', () => {
      const result = calculateFormattedUsdBalance(123.4561, 2.5, lang)
      expect(result).toEqual({
        formattedUsdPrice: '$2.50',
        formattedBalance: '123.4561',
        formattedBalanceUsd: '$308.64',
      })
    })

    it('handles large token balances with regular prices', () => {
      const result = calculateFormattedUsdBalance(5000, 1.25, lang)
      expect(result).toEqual({
        formattedUsdPrice: '$1.25',
        formattedBalance: '5,000',
        formattedBalanceUsd: '$6,250.00',
      })
    })

    it('handles calculations that result in very small USD balances', () => {
      const result = calculateFormattedUsdBalance(0.1, 0.0001, lang)
      expect(result).toEqual({
        formattedUsdPrice: '$0.0001',
        formattedBalance: '0.1',
        formattedBalanceUsd: '$0.00001',
      })
    })

    it('handles zero token balance', () => {
      const result = calculateFormattedUsdBalance(0, 100, lang)
      expect(result).toEqual({
        formattedUsdPrice: '$100.00',
        formattedBalance: '0',
        formattedBalanceUsd: '--',
      })
    })

    it('correctly removes commas and dollar signs in calculation', () => {
      // Large values that will have commas
      const result = calculateFormattedUsdBalance(1234, 5.671, lang)
      expect(result.formattedUsdPrice).toBe('$5.67')
      expect(result.formattedBalance).toBe('1,234')
      // 1234 * 5.67 = 6,996.78
      expect(result.formattedBalanceUsd).toBe('$6,996.78')
    })
  })

  describe('Edge Cases', () => {
    it('handles very large numbers', () => {
      expect(formatUsdValue(1000000, lang)).toBe('$1,000,000.00')
      expect(formatTokenBalance(999999999, lang)).toBe('999,999,999')
    })
  })
})
