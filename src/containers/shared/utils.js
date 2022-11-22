import axios from 'axios'
import { getQuorum, getNegativeUNL } from '../../rippled'
import Log from './log'

const THOUSAND = 1000
const MILLION = THOUSAND * THOUSAND
const BILLION = MILLION * THOUSAND
const TRILLION = BILLION * THOUSAND
const QUADRILLION = TRILLION * THOUSAND

const GA_ID = process.env.REACT_APP_GA_ID

const EXOTIC_SYMBOLS = {
  BTC: '\u20BF',
  XRP: '\uE900',
  ETH: '\uE902',
}

export const TITLE_LENGTH = 77
export const NOT_FOUND = 404
export const SERVER_ERROR = 500
export const BAD_REQUEST = 400

export const FETCH_INTERVAL_MILLIS = 5000
export const FETCH_INTERVAL_VHS_MILLIS = 60 * 1000 // 1 minute
export const FETCH_INTERVAL_NODES_MILLIS = 60000
export const FETCH_INTERVAL_ERROR_MILLIS = 300

export const DECIMAL_REGEX = /^\d+$/
export const RIPPLE_ADDRESS_REGEX =
  /^r[rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz]{27,35}$/
export const HASH_REGEX = /[0-9A-Fa-f]{64}/i
export const CURRENCY_REGEX =
  /^[a-zA-Z0-9]{3,}\.r[rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz]{27,35}$/
export const FULL_CURRENCY_REGEX =
  /^[0-9A-Fa-f]{40}\.r[rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz]{27,35}$/
export const VALIDATORS_REGEX = /^n[9H][0-9A-Za-z]{50}$/

export const UP_COLOR = '#2BCB96'
export const DOWN_COLOR = '#F23548'
export const LINE_COLOR = '#0F72E5'
export const BLACK_20 = '#E1E4E8'
export const BLACK_30 = '#C9CDD1'
export const BLACK_40 = '#B1B5BA'
export const BLACK_60 = '#6B7075'
export const WHITE = '#FFFFFF'
export const GREY = '#9BA2B0'
export const PURPLE = '#8884d8'
export const BLUE = '#1AA4FF'
export const RED = '#FF1A8B'
export const GREEN = '#19FF83'
export const GREY_600 = '#656E81'
export const GREY_800 = '#383D47'

export const BREAKPOINTS = {
  desktop: 1200,
  landscape: 900,
  portrait: 600,
  phone: 415,
}

export const ANALYTIC_TYPES = {
  pageview: 'pageview',
  event: 'event',
  social: 'social',
  timing: 'timing',
  exception: 'exception',
}

const NUMBER_DEFAULT_OPTIONS = {
  style: 'decimal',
  minimumFractionDigits: 0,
  maximumFractionDigits: 20,
  useGrouping: true,
}

const FORMAT_PRICE_DEFAULT_OPTIONS = {
  lang: 'en-US',
  currency: 'USD',
  decimals: 4,
  padding: 0,
}

export const isEarlierVersion = (source, target) => {
  if (source === target) return false
  if (source === 'N/A') return true
  if (target === 'N/A') return false
  const sourceDecomp = source.split('.')
  const targetDecomp = target.split('.')
  const sourceMajor = parseInt(sourceDecomp[0], 10)
  const sourceMinor = parseInt(sourceDecomp[1], 10)
  const targetMajor = parseInt(targetDecomp[0], 10)
  const targetMinor = parseInt(targetDecomp[1], 10)
  // Compare major version
  if (sourceMajor !== targetMajor) {
    return sourceMajor < targetMajor
  }
  // Compare minor version
  if (sourceMinor !== targetMinor) {
    return sourceMinor < targetMinor
  }
  const sourcePatch = sourceDecomp[2].split('-')
  const targetPatch = targetDecomp[2].split('-')

  const sourcePatchVersion = parseInt(sourcePatch[0], 10)
  const targetPatchVersion = parseInt(targetPatch[0], 10)

  // Compare patch version
  if (sourcePatchVersion !== targetPatchVersion) {
    return sourcePatchVersion < targetPatchVersion
  }

  // Compare release version
  if (sourcePatch.length !== targetPatch.length) {
    return sourcePatch.length < targetPatch.length
  }

  if (sourcePatch.length === 2) {
    // Compare different release types
    if (sourcePatch[1][0] !== targetPatch[1][0]) {
      return sourcePatch[1] < targetPatch[1]
    }
    // Compare beta version
    if (sourcePatch[1][0] === 'b') {
      return (
        parseInt(sourcePatch[1].slice(1), 10) <
        parseInt(targetPatch[1].slice(1), 10)
      )
    }
    // Compare rc version
    return (
      parseInt(sourcePatch[1].slice(2), 10) <
      parseInt(targetPatch[1].slice(2), 10)
    )
  }

  return false
}

export const normalizeLanguage = (lang) => {
  if (!lang) {
    return undefined
  }

  if (lang === 'en' || lang === 'en-US' || lang.indexOf('en-') === 0) {
    return 'en-US' // Only US English supported now
  }
  if (
    lang === 'zh' ||
    lang === 'zh-Hans' ||
    lang === 'zh-Hant' ||
    lang.indexOf('zh-') === 0
  ) {
    return 'zh-Hans' // Only Simplified chinese supported now
  }
  if (lang === 'ja' || lang === 'ja-JP' || lang.indexOf('ja-') === 0) {
    return 'ja-JP' // Japanese
  }
  if (
    lang === 'ko' ||
    lang === 'ko-KR' ||
    lang === 'ko-KP' ||
    lang.indexOf('ko-') === 0
  ) {
    return 'ko-KP' // Korean
  }
  if (
    lang === 'es' ||
    lang === 'es-ES' ||
    lang === 'es-MX' ||
    lang === 'es-AR' ||
    lang === 'es-CO' ||
    lang === 'es-CL' ||
    lang.indexOf('es-') === 0
  ) {
    return 'es-MX' // Mexican Spanish
  }
  if (lang === 'pt-PT' || lang === 'pt-BR' || lang.indexOf('pt-') === 0) {
    return 'pt-BR' // Brazilian Portuguese
  }

  return undefined
}

// Document: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat
export const localizeNumber = (num, lang = 'en-US', options = {}) => {
  const number = Number.parseFloat(num)
  const config = { ...NUMBER_DEFAULT_OPTIONS, ...options }

  if (Number.isNaN(number)) {
    return null
  }
  if (config.style === 'currency') {
    try {
      const neg = number < 0 ? '-' : ''
      const d = new Intl.NumberFormat(lang, config).format(number)
      const index = d.search(/\d/)
      const symbol = d.slice(0, index).replace(/-/, '').trim()
      const newSymbol =
        EXOTIC_SYMBOLS[config.currency] ||
        (symbol.toUpperCase() === config.currency.toUpperCase() ? '' : symbol)
      return `${neg}${newSymbol}${d.slice(index)}`
    } catch (error) {
      config.style = 'decimal'
      delete config.currency
      return Intl.NumberFormat(lang, config).format(number)
    }
  }

  return new Intl.NumberFormat(lang, config).format(number)
}

export function formatPrice(number, options = {}) {
  const { lang, currency, decimals, padding } = {
    ...FORMAT_PRICE_DEFAULT_OPTIONS,
    ...options,
  }
  return number
    ? localizeNumber(number.toPrecision(decimals), lang, {
        style: 'currency',
        currency,
        minimumFractionDigits: number.toPrecision(decimals).includes('.')
          ? padding
          : 0,
      })
    : undefined
}

// Document: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat
export const localizeDate = (date, lang = 'en-US', options = {}) => {
  // TODO: default config
  if (!date) {
    return null
  }
  return new Intl.DateTimeFormat(lang, options).format(date)
}

/**
 * extract new items from top of array b using iterator
 * and merge it into the state array a.
 * @param {any[]} a The nfts in state.
 * @param {any[]} b The new nfts from props.
 * @returns {any[]} Concatenated list.
 */
export const concatNFT = (a, b) => {
  if (a.length === 0) return b
  if (b.length === 0) return a
  if (a[0].NFTokenID === b[0].NFTokenID) return a

  // joins if b has only old new nfts or has new ones on top of old ones.
  let iterator = 0
  for (iterator = 0; iterator < b.length; iterator += 1) {
    if (b[iterator].NFTokenID === a[0].NFTokenID) {
      break
    }
  }
  return a.concat(b.slice(0, iterator))
}

export const getLocalizedCurrencySymbol = (
  lang = 'en-US',
  currency = 'USD',
) => {
  const options = {
    style: 'currency',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    currency,
  }

  const formatted = localizeNumber(1, lang, options)
  return formatted.split('1')[0].trim()
}

export const formatLargeNumber = (d = 0, digits = 4) => {
  let variableDigits = digits
  let numberOfZeros = 0
  let numberCopy = d
  if (d >= QUADRILLION) {
    return {
      num: (d / QUADRILLION).toFixed(digits),
      unit: 'Q',
    }
  }

  if (d >= TRILLION) {
    return {
      num: (d / TRILLION).toFixed(digits),
      unit: 'T',
    }
  }

  if (d >= BILLION) {
    return {
      num: (d / BILLION).toFixed(digits),
      unit: 'B',
    }
  }

  if (d >= MILLION) {
    return {
      num: (d / MILLION).toFixed(digits),
      unit: 'M',
    }
  }

  if (d >= THOUSAND) {
    return {
      num: (d / THOUSAND).toFixed(digits),
      unit: 'K',
    }
  }

  while (numberCopy < 1 && variableDigits < 20) {
    numberCopy *= 10
    numberOfZeros += 1
    variableDigits =
      numberOfZeros > variableDigits - 1 ? variableDigits + 1 : variableDigits
  }

  // handle zeros
  variableDigits = Math.trunc(d.toFixed(20)) === 0 ? digits : variableDigits

  if (digits < variableDigits) {
    variableDigits = digits
  }

  return {
    num: d.toFixed(variableDigits),
    unit: '',
  }
}

// Document: https://developers.google.com/analytics/devguides/collection/analyticsjs/
export const analytics = (type, fields = {}) => {
  // Chek if GoogleAnalytics is set, type and fields are not empty, type is valid
  if (
    !window.gtag ||
    !type ||
    Object.keys(fields).length === 0 ||
    Object.keys(ANALYTIC_TYPES).indexOf(type) === -1
  ) {
    return false
  }

  // Check for required fields for each type
  switch (type) {
    case ANALYTIC_TYPES.pageview:
      if (!!fields.title && !!fields.path) {
        window.gtag('config', GA_ID, {
          page_title: fields.title,
          page_path: fields.path,
        })
        return true
      }
      break
    case ANALYTIC_TYPES.event:
      if (!!fields.eventCategory && !!fields.eventAction) {
        window.gtag('event', fields.eventAction, {
          event_category: fields.eventCategory,
          event_label: fields.eventLabel,
        })
        return true
      }
      break
    case ANALYTIC_TYPES.exception:
      if (fields.exDescription) {
        window.gtag('event', 'exception', { description: fields.exDescription })
        return true
      }
      break
    default:
      return false
  }

  return false
}

export const durationToHuman = (s, decimal = 2) => {
  const d = {}
  const seconds = Math.abs(s)

  if (seconds < 60) {
    d.num = seconds
    d.unit = 'sec.'
  } else if (seconds < 60 * 60) {
    d.num = seconds / 60
    d.unit = 'min.'
  } else if (seconds < 60 * 60 * 24) {
    d.num = seconds / (60 * 60)
    d.unit = 'hr.'
  } else if (seconds < 60 * 60 * 24 * 180) {
    d.num = seconds / (60 * 60 * 24)
    d.unit = 'd.'
  } else if (seconds < 60 * 60 * 24 * 365 * 2) {
    d.num = seconds / (60 * 60 * 24 * 30.5)
    d.unit = 'mo.'
  } else {
    d.num = seconds / (60 * 60 * 24 * 365)
    d.unit = 'yr.'
  }

  return `${d.num.toFixed(decimal)} ${d.unit}`
}

export const fetchNegativeUNL = async (rippledSocket) =>
  getNegativeUNL(rippledSocket)
    .then((data) => {
      if (data === undefined) throw new Error('undefined nUNL')

      return data
    })
    .catch((e) => Log.error(e))

export const fetchQuorum = async (rippledSocket) =>
  getQuorum(rippledSocket)
    .then((data) => {
      if (data === undefined) throw new Error('undefined quorum')
      return data
    })
    .catch((e) => Log.error(e))

export const fetchMetrics = () =>
  axios
    .get('/api/v1/metrics')
    .then((result) => result.data)
    .catch((e) => Log.error(e))

export const removeRoutes = (routes, ...routesToRemove) =>
  routes.filter((route) => !routesToRemove.includes(route.title))

export const formatAsset = (asset) =>
  typeof asset === 'string'
    ? { currency: 'XRP' }
    : {
        currency: asset.currency,
        issuer: asset.issuer,
      }

export const localizeBalance = (balance, language) => {
  let b = localizeNumber(balance.amount || 0.0, language, {
    style: 'currency',
    currency: balance.currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })

  if (
    balance.currency !== 'XRP' &&
    balance.currency !== 'BTC' &&
    balance.currency !== 'ETH'
  ) {
    b = `${balance.currency} ${b}`
  }

  return b
}
