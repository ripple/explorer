import { PAGINATION_CONFIG, INITIAL_PAGE } from '../constants'

describe('Token Constants', () => {
  describe('PAGINATION_CONFIG', () => {
    it('should have HOLDERS_PAGE_SIZE defined', () => {
      expect(PAGINATION_CONFIG.HOLDERS_PAGE_SIZE).toBeDefined()
    })

    it('should have TRANSFERS_PAGE_SIZE defined', () => {
      expect(PAGINATION_CONFIG.TRANSFERS_PAGE_SIZE).toBeDefined()
    })

    it('should have DEX_TRADES_PAGE_SIZE defined', () => {
      expect(PAGINATION_CONFIG.DEX_TRADES_PAGE_SIZE).toBeDefined()
    })

    it('should have correct HOLDERS_PAGE_SIZE value', () => {
      expect(PAGINATION_CONFIG.HOLDERS_PAGE_SIZE).toBe(20)
    })

    it('should have correct TRANSFERS_PAGE_SIZE value', () => {
      expect(PAGINATION_CONFIG.TRANSFERS_PAGE_SIZE).toBe(10)
    })

    it('should have correct DEX_TRADES_PAGE_SIZE value', () => {
      expect(PAGINATION_CONFIG.DEX_TRADES_PAGE_SIZE).toBe(10)
    })

    it('should have consistent values', () => {
      // Verify the object exists and has the expected structure
      expect(PAGINATION_CONFIG).toBeDefined()
      expect(typeof PAGINATION_CONFIG.HOLDERS_PAGE_SIZE).toBe('number')
      expect(typeof PAGINATION_CONFIG.TRANSFERS_PAGE_SIZE).toBe('number')
      expect(typeof PAGINATION_CONFIG.DEX_TRADES_PAGE_SIZE).toBe('number')
    })

    it('should have all values as positive numbers', () => {
      expect(PAGINATION_CONFIG.HOLDERS_PAGE_SIZE).toBeGreaterThan(0)
      expect(PAGINATION_CONFIG.TRANSFERS_PAGE_SIZE).toBeGreaterThan(0)
      expect(PAGINATION_CONFIG.DEX_TRADES_PAGE_SIZE).toBeGreaterThan(0)
    })

    it('should have all values as integers', () => {
      expect(Number.isInteger(PAGINATION_CONFIG.HOLDERS_PAGE_SIZE)).toBe(true)
      expect(Number.isInteger(PAGINATION_CONFIG.TRANSFERS_PAGE_SIZE)).toBe(true)
      expect(Number.isInteger(PAGINATION_CONFIG.DEX_TRADES_PAGE_SIZE)).toBe(
        true,
      )
    })

    it('HOLDERS_PAGE_SIZE should be larger than TRANSFERS_PAGE_SIZE', () => {
      expect(PAGINATION_CONFIG.HOLDERS_PAGE_SIZE).toBeGreaterThan(
        PAGINATION_CONFIG.TRANSFERS_PAGE_SIZE,
      )
    })

    it('TRANSFERS_PAGE_SIZE should equal DEX_TRADES_PAGE_SIZE', () => {
      expect(PAGINATION_CONFIG.TRANSFERS_PAGE_SIZE).toBe(
        PAGINATION_CONFIG.DEX_TRADES_PAGE_SIZE,
      )
    })
  })

  describe('INITIAL_PAGE', () => {
    it('should be defined', () => {
      expect(INITIAL_PAGE).toBeDefined()
    })

    it('should equal 1', () => {
      expect(INITIAL_PAGE).toBe(1)
    })

    it('should be a positive number', () => {
      expect(INITIAL_PAGE).toBeGreaterThan(0)
    })

    it('should be an integer', () => {
      expect(Number.isInteger(INITIAL_PAGE)).toBe(true)
    })

    it('should be the first page', () => {
      expect(INITIAL_PAGE).toBe(1)
    })
  })

  describe('Constants consistency', () => {
    it('should have consistent pagination config structure', () => {
      const keys = Object.keys(PAGINATION_CONFIG)
      expect(keys).toContain('HOLDERS_PAGE_SIZE')
      expect(keys).toContain('TRANSFERS_PAGE_SIZE')
      expect(keys).toContain('DEX_TRADES_PAGE_SIZE')
    })

    it('should have exactly 3 pagination config keys', () => {
      const keys = Object.keys(PAGINATION_CONFIG)
      expect(keys.length).toBe(3)
    })

    it('all pagination sizes should be reasonable values', () => {
      expect(PAGINATION_CONFIG.HOLDERS_PAGE_SIZE).toBeLessThanOrEqual(100)
      expect(PAGINATION_CONFIG.TRANSFERS_PAGE_SIZE).toBeLessThanOrEqual(100)
      expect(PAGINATION_CONFIG.DEX_TRADES_PAGE_SIZE).toBeLessThanOrEqual(100)
    })
  })
})
