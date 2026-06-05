import {
  formatAmount,
  isMPTAmount,
  formatAsset,
  formatAmountWithAsset,
} from './formatAmount'

const TEST_MPT_ID = '000003C31D321B7DDA58324DC38CDF18934FAFFFCDF69D5F'

// MPTAmount upper bound from the XRPL spec: 2^63 - 1.
const MAX_MPT_VALUE = '9223372036854775807'

// IOU amounts (per ripple-binary-codec) are bounded by a 16-digit mantissa and
// an exponent in [-96, 80]. These are representative near-limit values.
const MAX_IOU_VALUE_STR = '9.999999999999999e+80'
const MIN_POSITIVE_IOU_VALUE_STR = '1e-96'

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
      mpt_issuance_id: TEST_MPT_ID,
      value: '1000',
    })
    expect(result).toEqual({
      currency: TEST_MPT_ID,
      amount: '1000',
      isMPT: true,
    })
  })

  it('preserves precision for MPTAmount at the spec maximum (2^63 - 1)', () => {
    const result = formatAmount({
      mpt_issuance_id: TEST_MPT_ID,
      value: MAX_MPT_VALUE,
    })
    expect(result).toEqual({
      currency: TEST_MPT_ID,
      amount: MAX_MPT_VALUE,
      isMPT: true,
    })
    // Confirm the digits survived round-trip and weren't coerced through Number.
    expect(typeof result!.amount).toBe('string')
    expect(BigInt(result!.amount as string)).toBe(BigInt(MAX_MPT_VALUE))
  })

  it('formats IOU near the spec maximum value', () => {
    const result = formatAmount({
      currency: 'USD',
      issuer: 'rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B',
      value: MAX_IOU_VALUE_STR,
    })
    // IOU amounts intentionally go through Number; the 16-digit mantissa fits
    // within JS Number's 15-17 significant-digit range, so the literal survives
    // unchanged round-tripping through parseFloat.
    expect(result!.currency).toBe('USD')
    expect(result!.amount).toBe(parseFloat(MAX_IOU_VALUE_STR))
    expect(Number.isFinite(result!.amount as number)).toBe(true)
  })

  it('formats IOU at the spec minimum positive value', () => {
    const result = formatAmount({
      currency: 'USD',
      issuer: 'rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B',
      value: MIN_POSITIVE_IOU_VALUE_STR,
    })
    expect(result!.amount).toBe(parseFloat(MIN_POSITIVE_IOU_VALUE_STR))
    expect(result!.amount).toBeGreaterThan(0)
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
        mpt_issuance_id: TEST_MPT_ID,
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
        mpt_issuance_id: TEST_MPT_ID,
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
      mpt_issuance_id: TEST_MPT_ID,
    })
    expect(result).toEqual({
      currency: TEST_MPT_ID,
      mpt_issuance_id: TEST_MPT_ID,
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

  it('formats MPT amount with asset (preserves string)', () => {
    const result = formatAmountWithAsset('500', {
      currency: TEST_MPT_ID,
      isMPT: true,
    })
    expect(result).toEqual({
      currency: TEST_MPT_ID,
      amount: '500',
      isMPT: true,
    })
  })

  it('preserves MPT precision for value at the spec maximum (2^63 - 1)', () => {
    const result = formatAmountWithAsset(MAX_MPT_VALUE, {
      currency: TEST_MPT_ID,
      isMPT: true,
    })
    expect(result).toEqual({
      currency: TEST_MPT_ID,
      amount: MAX_MPT_VALUE,
      isMPT: true,
    })
    expect(BigInt(result!.amount as string)).toBe(BigInt(MAX_MPT_VALUE))
  })

  it('preserves MPT precision when raw amount is given as a numeric input', () => {
    // Some upstream callers may pass `amount` as a number for small values.
    // We still want the result to be a string so the downstream Amount
    // component handles it via BigInt without coercion.
    const result = formatAmountWithAsset(1234567890, {
      currency: TEST_MPT_ID,
      isMPT: true,
    })
    expect(result).toEqual({
      currency: TEST_MPT_ID,
      amount: '1234567890',
      isMPT: true,
    })
  })

  it('returns undefined for null amount', () => {
    expect(
      formatAmountWithAsset(null as any, { currency: 'XRP' }),
    ).toBeUndefined()
  })
})
