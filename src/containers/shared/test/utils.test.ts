import {
  isEarlierVersion,
  formatLargeNumber,
  localizeNumber,
  formatPrice,
  getLocalizedCurrencySymbol,
  localizeDate,
  durationToHuman,
  formatDurationDetailed,
  formatAsset,
  shortenAccount,
  shortenDomain,
  shortenNFTTokenID,
  shortenMPTID,
  stripHttpProtocol,
} from '../utils'

describe('utils', () => {
  it('isEarlierVersion compare versions correctly', () => {
    expect(isEarlierVersion('1.6.2', 'N/A')).toEqual(false)
    expect(isEarlierVersion('N/A', '0.9.4')).toEqual(true)
    expect(isEarlierVersion('N/A', 'N/A')).toEqual(false)
    expect(isEarlierVersion('1.9.4', '1.9.4')).toEqual(false)
    expect(isEarlierVersion('0.9.2', '1.8.4')).toEqual(true)
    expect(isEarlierVersion('1.8.2', '1.9.4')).toEqual(true)
    expect(isEarlierVersion('1.9.2', '1.9.4')).toEqual(true)
    expect(isEarlierVersion('1.9.2', '1.9.2-b1')).toEqual(false)
    expect(isEarlierVersion('1.9.2', '1.9.2-rc2')).toEqual(false)
    expect(isEarlierVersion('1.9.4-b2', '1.9.4-rc1')).toEqual(true)
    expect(isEarlierVersion('1.9.4-b1', '1.9.4-b2')).toEqual(true)
    expect(isEarlierVersion('1.9.4-rc1', '1.9.4-rc2')).toEqual(true)
    expect(isEarlierVersion('1.6.2', '0.9.4')).toEqual(false)
    expect(isEarlierVersion('1.9.4', '1.8.6')).toEqual(false)
    expect(isEarlierVersion('1.9.4', '1.9.2-rc5')).toEqual(false)
    expect(isEarlierVersion('1.8.0-rc1', '1.8.0')).toEqual(true)
    expect(isEarlierVersion('1.9.4-rc1', '1.9.4-b3')).toEqual(false)
    expect(isEarlierVersion('1.9.4-b2', '1.9.4-b1')).toEqual(false)
    expect(isEarlierVersion('1.9.4-rc2', '1.9.4-rc1')).toEqual(false)
  })

  it('formatLargeNumber format numbers correctly', () => {
    expect(formatLargeNumber()).toEqual({ num: '0.0', unit: '' })
    expect(formatLargeNumber(2000000000000)).toEqual({
      num: '2.0',
      unit: 'T',
    })
    expect(formatLargeNumber(3300000000)).toEqual({ num: '3.3', unit: 'B' })
    expect(formatLargeNumber(44400000)).toEqual({ num: '44.4', unit: 'M' })
    expect(formatLargeNumber(555500)).toEqual({ num: '555.5', unit: 'K' })
    expect(formatLargeNumber(66.666, 2)).toEqual({ num: '66.67', unit: '' })
  })

  it('localizeNumber', () => {
    expect(localizeNumber()).toEqual(null)
    expect(
      localizeNumber(12.2334, 'en-US', { maximumFractionDigits: 2 }),
    ).toEqual('12.23')
    expect(
      localizeNumber(12.2334, 'en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 2,
      }),
    ).toEqual('$12.23')
    expect(
      localizeNumber(12.2334, 'en-US', {
        style: 'currency',
        currency: 'xrp',
        maximumFractionDigits: 2,
      }),
    ).toEqual('12.23')
    expect(
      localizeNumber(12.2334, 'en-US', {
        style: 'currency',
        currency: 'PRX',
        maximumFractionDigits: 2,
      }),
    ).toEqual('12.23')
    expect(
      localizeNumber(12.2334, 'en-US', {
        style: 'currency',
        currency: 'XRp',
        maximumFractionDigits: 2,
      }),
    ).toEqual('12.23')
    expect(
      localizeNumber(12.2334, 'en-US', {
        style: 'currency',
        currency: 'xrp',
        minimumFractionDigits: 6,
      }),
    ).toEqual('12.233400')
  })

  it('formatPrice', () => {
    expect(formatPrice(22.35)).toEqual('$22.35')
    expect(
      formatPrice(22.35, { lang: 'es-MX', currency: 'BTC', decimals: 3 }),
    ).toEqual('₿22.4')
    expect(
      formatPrice(22.356, {
        lang: 'en-US',
        currency: 'XRP',
        decimals: 4,
        padding: 6,
      }),
    ).toEqual('\uE90022.360000')
    expect(
      formatPrice(222.05, {
        lang: 'en-US',
        currency: 'XRP',
        decimals: 4,
        padding: 6,
      }),
    ).toEqual('\uE900222.100000')
    expect(
      formatPrice(2222.05, {
        lang: 'en-US',
        currency: 'XRP',
        decimals: 4,
        padding: 6,
      }),
    ).toEqual('\uE9002,222')
    expect(
      formatPrice(2222.3, {
        lang: 'en-US',
        currency: 'XRP',
        decimals: 4,
        padding: 6,
      }),
    ).toEqual('\uE9002,222')
    expect(
      formatPrice(2222, {
        lang: 'en-US',
        currency: 'XRP',
        decimals: 4,
        padding: 6,
      }),
    ).toEqual('\uE9002,222')
  })

  it('getLocalizedCurrencySymbol', () => {
    expect(getLocalizedCurrencySymbol()).toEqual('$')
    expect(getLocalizedCurrencySymbol('zh-Hans', 'CNY')).toEqual('¥')
    expect(getLocalizedCurrencySymbol('ja-JP', 'EUR')).toEqual('€')
    expect(getLocalizedCurrencySymbol('en-US', 'USDT')).toEqual('')
    expect(getLocalizedCurrencySymbol('en-US', 'BTC')).toEqual('₿')
    expect(getLocalizedCurrencySymbol('zh-Hans', 'XRP')).toEqual('\uE900')
    expect(getLocalizedCurrencySymbol('zh-Hans', 'ETH')).toEqual('\uE902')
  })

  it('localizeDate', () => {
    const d = new Date('Tue Mar 20 2018')
    expect(localizeDate()).toEqual(null)
    expect(localizeDate(d)).toEqual('3/20/2018')
  })

  test('duration to human', () => {
    expect(durationToHuman(30)).toBe('30.00 sec.')
    expect(durationToHuman(3000)).toBe('50.00 min.')
    expect(durationToHuman(30000)).toBe('8.33 hr.')
    expect(durationToHuman(300000)).toBe('3.47 d.')
    expect(durationToHuman(30000000)).toBe('11.38 mo.')
    expect(durationToHuman(300000000)).toBe('9.51 yr.')
  })

  test('format duration detailed', () => {
    // Basic cases
    expect(formatDurationDetailed(0)).toBe('0s')
    expect(formatDurationDetailed(30)).toBe('30s')
    expect(formatDurationDetailed(60)).toBe('1min')
    expect(formatDurationDetailed(3600)).toBe('1hr')
    expect(formatDurationDetailed(86400)).toBe('1d')
    expect(formatDurationDetailed(3665)).toBe('1hr.1min.5s')
    expect(formatDurationDetailed(90061)).toBe('1d.1hr.1min.1s')
    expect(formatDurationDetailed(7200 + 180 + 5)).toBe('2hr.3min.5s')
    expect(formatDurationDetailed(604800 + 14400 + 180 + 5)).toBe(
      '7d.4hr.3min.5s',
    )
    expect(formatDurationDetailed(31536000 + 86400 + 3600)).toBe('1yr.1d.1hr')
    expect(formatDurationDetailed(2629746)).toBe('30d.10hr.29min.6s')

    // Test maxUnits parameter
    expect(formatDurationDetailed(90061, 2)).toBe('1d.1hr')
    expect(formatDurationDetailed(90061, 3)).toBe('1d.1hr.1min')

    // Test negative values (should handle absolute value)
    expect(formatDurationDetailed(-3665)).toBe('1hr.1min.5s')
  })
})

describe('AMM utils format asset', () => {
  it('formats XRP asset', () => {
    const asset = '10000000000'
    const formatted = formatAsset(asset)

    expect(formatted).toEqual({ currency: 'XRP' })
  })

  it('formats non XRP asset', () => {
    const asset = { currency: 'USD', amount: '100000', issuer: 'your mom' }
    const formatted = formatAsset(asset)

    expect(formatted).toEqual({ currency: 'USD', issuer: 'your mom' })
  })
})

describe('Shorten utils', () => {
  describe('shortenAccount', () => {
    it('shortens long account addresses', () => {
      const longAccount = 'rN7n7otQDd6FczFgLdlqtyMVrn5f4W01dn'
      expect(shortenAccount(longAccount)).toBe('rN7n7ot...W01dn')
    })

    it('returns short account addresses unchanged', () => {
      const shortAccount = 'rShortAddr'
      expect(shortenAccount(shortAccount)).toBe(shortAccount)
    })
  })

  describe('stripHttpProtocol', () => {
    it('strips https:// protocol', () => {
      expect(stripHttpProtocol('https://www.example.com')).toBe(
        'www.example.com',
      )
    })

    it('strips http:// protocol', () => {
      expect(stripHttpProtocol('http://example.com')).toBe('example.com')
    })

    it('returns domain unchanged if no protocol', () => {
      expect(stripHttpProtocol('example.com')).toBe('example.com')
    })
  })

  describe('shortenDomain', () => {
    it('shortens long domain names', () => {
      const longDomain = 'verylongdomainnamethatexceedslimit.com'
      expect(shortenDomain(longDomain)).toBe('verylongdomainn...dslimit.com')
    })

    it('returns short domain names unchanged', () => {
      const shortDomain = 'example.com'
      expect(shortenDomain(shortDomain)).toBe(shortDomain)
    })
  })

  describe('shortenNFTTokenID', () => {
    it('shortens long NFT token IDs', () => {
      const longTokenID =
        '000827103B94ECBB7BF0A0A6ED62B3607801A27B65F4B11F5E1D5E8A3F3D8E9A'
      expect(shortenNFTTokenID(longTokenID)).toBe('000827103B...8A3F3D8E9A')
    })

    it('returns short NFT token IDs unchanged', () => {
      const shortTokenID = '000827103B94ECBB7BF0'
      expect(shortenNFTTokenID(shortTokenID)).toBe(shortTokenID)
    })
  })

  describe('shortenMPTID', () => {
    it('shortens long MPT token IDs', () => {
      const longMPTID =
        '00000000A8B71A79C3CE4E8A3F3D8E9A5BEB9D7C6F4B11F5E1D5E8A3F3D8E9A'
      expect(shortenMPTID(longMPTID)).toBe('00000000A8...8A3F3D8E9A')
    })

    it('returns short MPT token IDs unchanged', () => {
      const shortMPTID = '00000000A8B71A79C3CE'
      expect(shortenMPTID(shortMPTID)).toBe(shortMPTID)
    })
  })
})
