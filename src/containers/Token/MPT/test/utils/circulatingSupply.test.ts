import { calculateMptCirculatingSupply } from '../../utils/circulatingSupply'

describe('calculateMptCirculatingSupply', () => {
  it('returns the scaled outstanding amount when there are no holders', () => {
    expect(calculateMptCirculatingSupply('1000000', 0, undefined, false)).toBe(
      '1000000',
    )
  })

  it('applies the asset scale to the outstanding amount', () => {
    // 281380138 / 10^7 = 28.1380138
    expect(calculateMptCirculatingSupply('281380138', 7, [], false)).toBe(
      '28.1380138',
    )
  })

  it('subtracts a holder at or above the 20% threshold', () => {
    expect(
      calculateMptCirculatingSupply(
        '1000000',
        0,
        [{ percent: 30, rawBalance: '300000' }],
        false,
      ),
    ).toBe('700000')
  })

  it('ignores holders below the 20% threshold', () => {
    expect(
      calculateMptCirculatingSupply(
        '1000000',
        0,
        [{ percent: 10, rawBalance: '300000' }],
        false,
      ),
    ).toBe('1000000')
  })

  it('subtracts every large holder', () => {
    expect(
      calculateMptCirculatingSupply(
        '1000000',
        0,
        [
          { percent: 50, rawBalance: '500000' },
          { percent: 20, rawBalance: '200000' },
          { percent: 5, rawBalance: '50000' },
        ],
        false,
      ),
    ).toBe('300000')
  })

  it('does NOT subtract large holders for RWA tokens', () => {
    expect(
      calculateMptCirculatingSupply(
        '1000000',
        0,
        [{ percent: 90, rawBalance: '900000' }],
        true, // isRwa
      ),
    ).toBe('1000000')
  })

  it('returns exactly 0 (not a float residue) when large holders hold everything', () => {
    // Regression: the previous Number-based math returned 2.3283064365386963e-10
    // for these inputs, which parseAmount rendered as "< 0.0001" instead of "0.00".
    expect(
      calculateMptCirculatingSupply(
        '2438827633859',
        6,
        [
          { percent: 40.86, rawBalance: '996733784676' },
          { percent: 24.44, rawBalance: '596075534821' },
          { percent: 34.68, rawBalance: '846018314362' },
        ],
        false,
      ),
    ).toBe('0')
  })

  it('stays exact for amounts beyond double precision', () => {
    // UInt64 max (2^63-1) exceeds Number.MAX_SAFE_INTEGER; a Number-based
    // subtraction would lose the trailing digits.
    expect(
      calculateMptCirculatingSupply(
        '9223372036854775807',
        0,
        [{ percent: 50, rawBalance: '9223372036854775800' }],
        false,
      ),
    ).toBe('7')
  })

  it('floors at 0 instead of going negative', () => {
    expect(
      calculateMptCirculatingSupply(
        '100',
        0,
        [{ percent: 100, rawBalance: '200' }],
        false,
      ),
    ).toBe('0')
  })

  it('treats a missing outstanding amount as 0', () => {
    expect(calculateMptCirculatingSupply(undefined, 0, undefined, false)).toBe(
      '0',
    )
  })
})
