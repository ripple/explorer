import {
  formatAmount,
  isMPTAmount,
  formatAsset,
  formatAmountWithAsset,
} from './formatAmount'

describe('formatAmount', () => {
  it('formats XRP string amount', () => {
    const result = formatAmount('24755081083')
    expect(result).toEqual({ currency: 'XRP', amount: 24755.081083 })
  })

  it('formats IOU amount', () => {
    const result = formatAmount({
      currency: 'USD',
      issuer: 'rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B',
      value: '100.5',
    })
    expect(result).toEqual({
      currency: 'USD',
      issuer: 'rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B',
      amount: 100.5,
    })
  })

  it('formats MPTAmount', () => {
    const result = formatAmount({
      mpt_issuance_id: '000003C31D321B7DDA58324DC38CDF18934FAFFFCDF69D5F',
      value: '1000',
    })
    expect(result).toEqual({
      currency: '000003C31D321B7DDA58324DC38CDF18934FAFFFCDF69D5F',
      amount: '1000',
      isMPT: true,
    })
  })

  it('handles null and undefined', () => {
    expect(formatAmount(null as any)).toBeNull()
    expect(formatAmount(undefined as any)).toBeUndefined()
  })
})

describe('isMPTAmount', () => {
  it('returns true for MPTAmount', () => {
    expect(
      isMPTAmount({
        mpt_issuance_id: '000003C31D321B7DDA58324DC38CDF18934FAFFFCDF69D5F',
        value: '100',
      }),
    ).toBe(true)
  })

  it('returns false for XRP string', () => {
    expect(isMPTAmount('12345' as any)).toBe(false)
  })

  it('returns false for IOU', () => {
    expect(
      isMPTAmount({
        currency: 'USD',
        issuer: 'rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B',
        value: '100',
      } as any),
    ).toBe(false)
  })

  it('returns false for MPT asset without value', () => {
    expect(
      isMPTAmount({
        mpt_issuance_id: '000003C31D321B7DDA58324DC38CDF18934FAFFFCDF69D5F',
      } as any),
    ).toBe(false)
  })
})

describe('formatAsset', () => {
  it('formats XRP string', () => {
    expect(formatAsset('XRP')).toEqual({ currency: 'XRP' })
  })

  it('formats IOU asset', () => {
    expect(formatAsset({ currency: 'USD', issuer: 'rXXX' })).toEqual({
      currency: 'USD',
      issuer: 'rXXX',
    })
  })

  it('formats MPT asset', () => {
    const result = formatAsset({
      mpt_issuance_id: '000003C31D321B7DDA58324DC38CDF18934FAFFFCDF69D5F',
    })
    expect(result).toEqual({
      currency: '000003C31D321B7DDA58324DC38CDF18934FAFFFCDF69D5F',
      mpt_issuance_id: '000003C31D321B7DDA58324DC38CDF18934FAFFFCDF69D5F',
      isMPT: true,
    })
  })
})

describe('formatAmountWithAsset', () => {
  it('formats XRP amount with asset', () => {
    expect(formatAmountWithAsset(1000000, { currency: 'XRP' })).toEqual({
      currency: 'XRP',
      amount: 1,
    })
  })

  it('formats MPT amount with asset', () => {
    const result = formatAmountWithAsset('500', {
      currency: '000003C31D321B7DDA58324DC38CDF18934FAFFFCDF69D5F',
      isMPT: true,
    })
    expect(result).toEqual({
      currency: '000003C31D321B7DDA58324DC38CDF18934FAFFFCDF69D5F',
      amount: 500,
      isMPT: true,
    })
  })

  it('returns undefined for null amount', () => {
    expect(
      formatAmountWithAsset(null as any, { currency: 'XRP' }),
    ).toBeUndefined()
  })
})
