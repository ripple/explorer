import {
  formatLargeNumber,
  normalizeLanguage,
  localizeNumber,
  formatPrice,
  getLocalizedCurrencySymbol,
  localizeDate,
  analytics,
  ANALYTIC_TYPES,
  durationToHuman,
} from '../utils';

describe('utils', () => {
  it('formatLargeNumber format numbers correctly', () => {
    expect(formatLargeNumber()).toEqual({ num: '0.000000', unit: '' });
    expect(formatLargeNumber(2000000000000)).toEqual({ num: '2.000000', unit: 'T' });
    expect(formatLargeNumber(3300000000)).toEqual({ num: '3.300000', unit: 'B' });
    expect(formatLargeNumber(44400000)).toEqual({ num: '44.400000', unit: 'M' });
    expect(formatLargeNumber(555500)).toEqual({ num: '555.500000', unit: 'K' });
    expect(formatLargeNumber(66.666, 2)).toEqual({ num: '66.666000', unit: '' });
  });

  it('normalizeLanguage', () => {
    expect(normalizeLanguage('en')).toEqual('en-US');
    expect(normalizeLanguage('en-US')).toEqual('en-US');
    expect(normalizeLanguage('zh')).toEqual('zh-Hans');
    expect(normalizeLanguage('zh-Hant')).toEqual('zh-Hans');
    expect(normalizeLanguage('zh-Hans')).toEqual('zh-Hans');
    expect(normalizeLanguage('zh-Ti')).toEqual('zh-Hans');
    expect(normalizeLanguage('ja')).toEqual('ja-JP');
    expect(normalizeLanguage('ja-JP')).toEqual('ja-JP');
    expect(normalizeLanguage('ja-Ti')).toEqual('ja-JP');
    expect(normalizeLanguage('ko')).toEqual('ko-KP');
    expect(normalizeLanguage('ko-KP')).toEqual('ko-KP');
    expect(normalizeLanguage('ko-KR')).toEqual('ko-KP');
    expect(normalizeLanguage('ko-Ti')).toEqual('ko-KP');
    expect(normalizeLanguage('es')).toEqual('es-MX');
    expect(normalizeLanguage('es-MX')).toEqual('es-MX');
    expect(normalizeLanguage('pt-PT')).toEqual('pt-BR');
    expect(normalizeLanguage('in-IN')).toEqual(undefined);
    expect(normalizeLanguage('')).toEqual(undefined);
    expect(normalizeLanguage()).toEqual(undefined);
  });

  it('localizeNumber', () => {
    expect(localizeNumber()).toEqual(null);
    expect(localizeNumber(12.2334, 'en-US', { maximumFractionDigits: 2 })).toEqual('12.23');
    expect(
      localizeNumber(12.2334, 'en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 2,
      })
    ).toEqual('$12.23');
    expect(
      localizeNumber(12.2334, 'en-US', {
        style: 'currency',
        currency: 'xrp',
        maximumFractionDigits: 2,
      })
    ).toEqual('12.23');
    expect(
      localizeNumber(12.2334, 'en-US', {
        style: 'currency',
        currency: 'PRX',
        maximumFractionDigits: 2,
      })
    ).toEqual('12.23');
    expect(
      localizeNumber(12.2334, 'en-US', {
        style: 'currency',
        currency: 'XRp',
        maximumFractionDigits: 2,
      })
    ).toEqual('12.23');
  });

  it('formatPrice', () => {
    expect(formatPrice(22.35)).toEqual('$22.35');
    expect(formatPrice(22.35, 'es-MX', 'BTC', 3)).toEqual('₿22.4');
  });

  it('getLocalizedCurrencySymbol', () => {
    expect(getLocalizedCurrencySymbol()).toEqual('$');
    expect(getLocalizedCurrencySymbol('zh-Hans', 'CNY')).toEqual('¥');
    expect(getLocalizedCurrencySymbol('ja-JP', 'EUR')).toEqual('€');
    expect(getLocalizedCurrencySymbol('en-US', 'USDT')).toEqual('');
    expect(getLocalizedCurrencySymbol('en-US', 'BTC')).toEqual('₿');
    expect(getLocalizedCurrencySymbol('zh-Hans', 'XRP')).toEqual('\uE900');
    expect(getLocalizedCurrencySymbol('zh-Hans', 'ETH')).toEqual('\uE902');
  });

  it('localizeDate', () => {
    const d = new Date('Tue Mar 20 2018');
    expect(localizeDate()).toEqual(null);
    expect(localizeDate(d)).toEqual('3/20/2018');
  });

  it('google analyitcs', () => {
    expect(analytics(ANALYTIC_TYPES.pageview, {})).toEqual(false);
    expect(analytics(ANALYTIC_TYPES.event, {})).toEqual(false);
    expect(analytics(ANALYTIC_TYPES.social, {})).toEqual(false);
    expect(analytics(ANALYTIC_TYPES.timing, {})).toEqual(false);
    expect(analytics(ANALYTIC_TYPES.exception, {})).toEqual(false);
    expect(analytics()).toEqual(false);
    expect(analytics(ANALYTIC_TYPES.pageview, { title: 'Transaction', path: '/tx' })).toEqual(true);
    expect(analytics(ANALYTIC_TYPES.pageview, { blah: 'blah' })).toEqual(false);
    expect(
      analytics(ANALYTIC_TYPES.event, {
        eventCategory: 'MobileMenu',
        eventAction: 'Open',
      })
    ).toEqual(true);
    expect(
      analytics(ANALYTIC_TYPES.exception, {
        exDescription: 'something bad happened',
      })
    ).toEqual(true);
  });

  test('duration to human', () => {
    expect(durationToHuman(30)).toBe('30.00 sec.');
    expect(durationToHuman(3000)).toBe('50.00 min.');
    expect(durationToHuman(30000)).toBe('8.33 hr.');
    expect(durationToHuman(300000)).toBe('3.47 d.');
    expect(durationToHuman(30000000)).toBe('11.38 mo.');
    expect(durationToHuman(300000000)).toBe('9.51 yr.');
  });
});
