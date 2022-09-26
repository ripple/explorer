import {
  isLaterVersion,
  formatLargeNumber,
  normalizeLanguage,
  localizeNumber,
  formatPrice,
  getLocalizedCurrencySymbol,
  localizeDate,
  analytics,
  ANALYTIC_TYPES,
  durationToHuman,
} from '../utils'

describe('utils', () => {
  it('isLaterVersion compare versions correctly', () => {
    expect(isLaterVersion('1.6.2', 'N/A')).toEqual(true)
    expect(isLaterVersion('N/A', '0.9.4')).toEqual(false)
    expect(isLaterVersion('N/A', 'N/A')).toEqual(false)
    expect(isLaterVersion('1.9.4', '1.9.4')).toEqual(false)
    expect(isLaterVersion('1.9.4-b1', '1.9.4-b1')).toEqual(false)
    expect(isLaterVersion('1.9.4-rc1', '1.9.4-rc1')).toEqual(false)
    expect(isLaterVersion('0.9.2', '1.8.4')).toEqual(false)
    expect(isLaterVersion('1.8.2', '1.9.4')).toEqual(false)
    expect(isLaterVersion('1.9.2', '1.9.4')).toEqual(false)
    expect(isLaterVersion('1.9.2', '1.9.2-b1')).toEqual(false)
    expect(isLaterVersion('1.9.4-b2', '1.9.4-rc1')).toEqual(false)
    expect(isLaterVersion('1.9.4-b1', '1.9.4-b2')).toEqual(false)
    expect(isLaterVersion('1.9.4-rc1', '1.9.4-rc2')).toEqual(false)
    expect(isLaterVersion('1.6.2', '0.9.4')).toEqual(true)
    expect(isLaterVersion('1.9.4', '1.8.6')).toEqual(true)
    expect(isLaterVersion('1.9.4', '1.9.2-rc5')).toEqual(true)
    expect(isLaterVersion('1.8.0-rc1', '1.8.0')).toEqual(true)
    expect(isLaterVersion('1.9.4-rc1', '1.9.4-b3')).toEqual(true)
    expect(isLaterVersion('1.9.4-b2', '1.9.4-b1')).toEqual(true)
    expect(isLaterVersion('1.9.4-rc2', '1.9.4-rc1')).toEqual(true)
  })

  it('formatLargeNumber format numbers correctly', () => {
    expect(formatLargeNumber()).toEqual({ num: '0.0000', unit: '' })
    expect(formatLargeNumber(2000000000000)).toEqual({
      num: '2.0000',
      unit: 'T',
    })
    expect(formatLargeNumber(3300000000)).toEqual({ num: '3.3000', unit: 'B' })
    expect(formatLargeNumber(44400000)).toEqual({ num: '44.4000', unit: 'M' })
    expect(formatLargeNumber(555500)).toEqual({ num: '555.5000', unit: 'K' })
    expect(formatLargeNumber(66.666, 2)).toEqual({ num: '66.67', unit: '' })
  })

  it('normalizeLanguage', () => {
    expect(normalizeLanguage('en')).toEqual('en-US')
    expect(normalizeLanguage('en-US')).toEqual('en-US')
    expect(normalizeLanguage('zh')).toEqual('zh-Hans')
    expect(normalizeLanguage('zh-Hant')).toEqual('zh-Hans')
    expect(normalizeLanguage('zh-Hans')).toEqual('zh-Hans')
    expect(normalizeLanguage('zh-Ti')).toEqual('zh-Hans')
    expect(normalizeLanguage('ja')).toEqual('ja-JP')
    expect(normalizeLanguage('ja-JP')).toEqual('ja-JP')
    expect(normalizeLanguage('ja-Ti')).toEqual('ja-JP')
    expect(normalizeLanguage('ko')).toEqual('ko-KP')
    expect(normalizeLanguage('ko-KP')).toEqual('ko-KP')
    expect(normalizeLanguage('ko-KR')).toEqual('ko-KP')
    expect(normalizeLanguage('ko-Ti')).toEqual('ko-KP')
    expect(normalizeLanguage('es')).toEqual('es-MX')
    expect(normalizeLanguage('es-MX')).toEqual('es-MX')
    expect(normalizeLanguage('pt-PT')).toEqual('pt-BR')
    expect(normalizeLanguage('in-IN')).toEqual(undefined)
    expect(normalizeLanguage('')).toEqual(undefined)
    expect(normalizeLanguage()).toEqual(undefined)
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

  it('google analyitcs', () => {
    expect(analytics(ANALYTIC_TYPES.pageview, {})).toEqual(false)
    expect(analytics(ANALYTIC_TYPES.event, {})).toEqual(false)
    expect(analytics(ANALYTIC_TYPES.social, {})).toEqual(false)
    expect(analytics(ANALYTIC_TYPES.timing, {})).toEqual(false)
    expect(analytics(ANALYTIC_TYPES.exception, {})).toEqual(false)
    expect(analytics()).toEqual(false)
    expect(
      analytics(ANALYTIC_TYPES.pageview, { title: 'Transaction', path: '/tx' }),
    ).toEqual(true)
    expect(analytics(ANALYTIC_TYPES.pageview, { blah: 'blah' })).toEqual(false)
    expect(
      analytics(ANALYTIC_TYPES.event, {
        eventCategory: 'MobileMenu',
        eventAction: 'Open',
      }),
    ).toEqual(true)
    expect(
      analytics(ANALYTIC_TYPES.exception, {
        exDescription: 'something bad happened',
      }),
    ).toEqual(true)
  })

  test('duration to human', () => {
    expect(durationToHuman(30)).toBe('30.00 sec.')
    expect(durationToHuman(3000)).toBe('50.00 min.')
    expect(durationToHuman(30000)).toBe('8.33 hr.')
    expect(durationToHuman(300000)).toBe('3.47 d.')
    expect(durationToHuman(30000000)).toBe('11.38 mo.')
    expect(durationToHuman(300000000)).toBe('9.51 yr.')
  })
})
