import {
  LARGE_HOLDER_THRESHOLD_PERCENT,
  calculateIouCirculatingSupply,
  isLargeHolder,
  isRwaAssetClass,
  subtractLargeHolderBalances,
} from '../../utils/circulatingSupply'

describe('isLargeHolder', () => {
  it('is true at or above the threshold', () => {
    expect(isLargeHolder(LARGE_HOLDER_THRESHOLD_PERCENT)).toBe(true)
    expect(isLargeHolder(99)).toBe(true)
  })

  it('is false below the threshold', () => {
    expect(isLargeHolder(19.99)).toBe(false)
    expect(isLargeHolder(0)).toBe(false)
  })
})

describe('subtractLargeHolderBalances', () => {
  it('returns supply unchanged when there are no holders', () => {
    expect(subtractLargeHolderBalances(1000, undefined)).toBe(1000)
    expect(subtractLargeHolderBalances(1000, [])).toBe(1000)
  })

  it('subtracts a single holder at or above the threshold', () => {
    expect(
      subtractLargeHolderBalances(1000, [{ percent: 25, balance: 300 }]),
    ).toBe(700)
  })

  it('ignores holders below the threshold', () => {
    expect(
      subtractLargeHolderBalances(1000, [{ percent: 19.99, balance: 300 }]),
    ).toBe(1000)
  })

  it('treats exactly the threshold as a large holder', () => {
    expect(
      subtractLargeHolderBalances(1000, [
        { percent: LARGE_HOLDER_THRESHOLD_PERCENT, balance: 200 },
      ]),
    ).toBe(800)
  })

  it('subtracts every large holder but keeps small ones', () => {
    expect(
      subtractLargeHolderBalances(1000, [
        { percent: 50, balance: 500 },
        { percent: 20, balance: 200 },
        { percent: 5, balance: 50 },
      ]),
    ).toBe(300)
  })
})

describe('isRwaAssetClass', () => {
  it('is true for the lowercase "rwa" asset class', () => {
    expect(isRwaAssetClass('rwa')).toBe(true)
  })

  it('is false for other asset classes and undefined', () => {
    expect(isRwaAssetClass('other')).toBe(false)
    expect(isRwaAssetClass('US Treasuries')).toBe(false)
    expect(isRwaAssetClass(undefined)).toBe(false)
  })

  it('matches strictly — the XLS-89 asset_class is always lowercase', () => {
    expect(isRwaAssetClass('RWA')).toBe(false)
    expect(isRwaAssetClass(' rwa ')).toBe(false)
  })
})

describe('calculateIouCirculatingSupply', () => {
  const holdersData = {
    totalSupply: 1000,
    holders: [
      { percent: 25, balance: 250 },
      { percent: 15, balance: 150 },
    ],
  }

  it('prefers the reported circulating supply when present', () => {
    expect(
      calculateIouCirculatingSupply(
        { supply: '1000', circ_supply: '800' },
        holdersData,
      ),
    ).toBe(800)
  })

  it('subtracts large holders from the reported supply', () => {
    expect(calculateIouCirculatingSupply({ supply: '1000' }, holdersData)).toBe(
      750,
    )
  })

  it('falls back to the holders total supply when supply is missing', () => {
    expect(calculateIouCirculatingSupply({}, holdersData)).toBe(750)
  })

  it('does not subtract large holders for RWA tokens (incl. stablecoins, an RWA subclass)', () => {
    expect(
      calculateIouCirculatingSupply(
        { supply: '1000', asset_class: 'rwa' },
        holdersData,
      ),
    ).toBe(1000)
  })

  it('still subtracts for non-RWA asset classes', () => {
    expect(
      calculateIouCirculatingSupply(
        { supply: '1000', asset_class: 'memes' },
        holdersData,
      ),
    ).toBe(750)
  })

  it('returns 0 when there is no supply data at all', () => {
    expect(calculateIouCirculatingSupply({}, undefined)).toBe(0)
  })
})
