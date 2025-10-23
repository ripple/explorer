import { truncateString } from '../../utils/stringFormatting'

describe('stringFormatting', () => {
  describe('truncateString', () => {
    it('returns empty string for null input', () => {
      const result = truncateString(null)
      expect(result).toBe('')
    })

    it('returns empty string for undefined input', () => {
      const result = truncateString(undefined)
      expect(result).toBe('')
    })

    it('returns original string when shorter than total length', () => {
      const result = truncateString('short')
      expect(result).toBe('short')
    })

    it('returns original string when equal to total length', () => {
      const result = truncateString('123456789012')
      expect(result).toBe('123456789012')
    })

    it('truncates long string with default parameters', () => {
      const result = truncateString('123456789012345678')
      expect(result).toBe('123456...345678')
    })

    it('truncates with custom start length', () => {
      const result = truncateString('123456789012345678', 3)
      expect(result).toBe('123...345678')
    })

    it('truncates with custom end length', () => {
      const result = truncateString('123456789012345678', 6, 3)
      expect(result).toBe('123456...678')
    })

    it('truncates with custom start and end lengths', () => {
      const result = truncateString('123456789012345678', 4, 4)
      expect(result).toBe('1234...5678')
    })

    it('handles single character start and end lengths', () => {
      const result = truncateString('123456789012345678', 1, 1)
      expect(result).toBe('1...8')
    })

    it('handles zero start length', () => {
      const result = truncateString('123456789012345678', 0, 6)
      expect(result).toBe('...345678')
    })

    it('handles zero end length', () => {
      const result = truncateString('123456789012345678', 6, 0)
      expect(result).toBe('123456...')
    })

    it('handles zero start and end lengths', () => {
      const result = truncateString('123456789012345678', 0, 0)
      expect(result).toBe('...')
    })

    it('handles very long strings', () => {
      const longString = 'a'.repeat(1000)
      const result = truncateString(longString, 6, 6)
      expect(result).toBe('aaaaaa...aaaaaa')
    })

    it('handles strings with special characters', () => {
      const result = truncateString('rN7n7otQDd6FczFgLdlqtyMVrn3Rqq', 6, 6)
      expect(result).toBe('rN7n7o...Rqq')
    })

    it('handles strings with spaces', () => {
      const result = truncateString(
        'This is a very long string with spaces',
        6,
        6,
      )
      expect(result).toBe('This i...spaces')
    })

    it('handles strings with numbers and letters', () => {
      const result = truncateString('ABC123DEF456GHI789', 3, 3)
      expect(result).toBe('ABC...789')
    })

    it('handles empty string', () => {
      const result = truncateString('')
      expect(result).toBe('')
    })

    it('handles string with exactly startLength + endLength characters', () => {
      const result = truncateString('123456789012', 6, 6)
      expect(result).toBe('123456789012')
    })

    it('handles string with startLength + endLength + 1 characters', () => {
      const result = truncateString('1234567890123', 6, 6)
      expect(result).toBe('123456...90123')
    })

    it('handles large start and end lengths', () => {
      const result = truncateString('123456789012345678', 10, 10)
      expect(result).toBe('123456789012345678')
    })

    it('handles XRPL account addresses', () => {
      const address = 'rN7n7otQDd6FczFgLdlqtyMVrn3Rqq'
      const result = truncateString(address, 6, 6)
      expect(result).toBe('rN7n7o...n3Rqq')
    })

    it('handles currency codes', () => {
      const currency = '015841551A748AD2C1F76FF6ECB0CCCD00000000'
      const result = truncateString(currency, 4, 4)
      expect(result).toBe('0158...0000')
    })

    it('preserves ellipsis in output', () => {
      const result = truncateString('123456789012345678', 6, 6)
      expect(result).toContain('...')
    })

    it('does not truncate when string length equals startLength + endLength', () => {
      const str = '123456789012'
      const result = truncateString(str, 6, 6)
      expect(result).toBe(str)
    })

    it('handles unicode characters', () => {
      const result = truncateString('🚀🌟💎🔥🎯🎨🎭🎪🎬🎤', 2, 2)
      expect(result).toContain('...')
    })
  })
})
