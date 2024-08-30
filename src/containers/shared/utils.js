const THOUSAND = 1000
const MILLION = THOUSAND * THOUSAND
const BILLION = MILLION * THOUSAND
const TRILLION = BILLION * THOUSAND
const QUADRILLION = TRILLION * THOUSAND

const TRADING_FEE_TOTAL = 1000

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
export const HASH256_REGEX = /[0-9A-Fa-f]{64}/i
export const HASH192_REGEX = /[0-9A-Fa-f]{48}/i
export const CURRENCY_REGEX =
  /^[a-zA-Z0-9]{3,}[.:+-]r[rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz]{27,35}$/
export const FULL_CURRENCY_REGEX =
  /^[0-9A-Fa-f]{40}[.:+-]r[rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz]{27,35}$/
export const VALIDATORS_REGEX = /^n[9H][0-9A-Za-z]{50}$/
export const CTID_REGEX = /^[cC][0-9A-Za-z]{15}$/

export const PURPLE = '#8884d8'
export const GREEN_400 = '#5BEB9D'
export const GREEN_500 = '#32E685'
export const GREEN_800 = '#1E8A50'
export const PURPLE_500 = '#7919FF'
export const PURPLE_700 = '#4A00B2'
export const GREY_0 = '#FFFFFF'
export const GREY_400 = '#A2A2A4'
export const GREY_600 = '#656E81'
export const GREY_800 = '#383D47'
export const BLACK_600 = '#454549'
export const MAGENTA_700 = '#B20058'

export const BREAKPOINTS = {
  desktop: 1200,
  landscape: 900,
  portrait: 600,
  phone: 415,
}

export const CURRENCY_OPTIONS = {
  style: 'currency',
  currency: '',
  minimumFractionDigits: 2,
  maximumFractionDigits: 8,
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
    return sourcePatch.length > targetPatch.length
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

export const localizeMPTNumber = (num, scale, lang = 'en-US', options = {}) => {
  const number = Number.parseFloat(num)
  const config = { ...NUMBER_DEFAULT_OPTIONS, ...options }

  if (Number.isNaN(number)) {
    return null
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

export const convertHexToBigInt = (s) => BigInt(`0x${s}`)

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

export const removeRoutes = (routes, ...routesToRemove) =>
  routes.filter((route) => !routesToRemove.includes(route.title))

export const formatAsset = (asset) =>
  typeof asset === 'string'
    ? { currency: 'XRP' }
    : {
        currency: asset.currency,
        issuer: asset.issuer,
      }

export const formatTradingFee = (tradingFee) =>
  tradingFee !== undefined
    ? localizeNumber(tradingFee / TRADING_FEE_TOTAL, 'en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 3,
      })
    : undefined

export const computeRippleStateBalanceChange = (node) => {
  const fields = node.FinalFields || node.NewFields
  const prev = node.PreviousFields
  const { currency } = fields.Balance
  const numberOption = { ...CURRENCY_OPTIONS, currency }
  let finalBalance = fields.Balance.value
  let previousBalance = prev && prev.Balance ? prev.Balance.value : 0
  let account
  let counterAccount

  if (finalBalance < 0) {
    account = fields.HighLimit.issuer
    counterAccount = fields.LowLimit.issuer
    finalBalance = 0 - finalBalance
    previousBalance = 0 - previousBalance
  } else {
    account = fields.LowLimit.issuer
    counterAccount = fields.HighLimit.issuer
  }

  const change = finalBalance - previousBalance
  return {
    change,
    numberOption,
    previousBalance,
    finalBalance,
    currency,
    account,
    counterAccount,
  }
}

export const computeMPTokenBalanceChange = (node) => {
  const final = node.FinalFields || node.NewFields
  const prev = node.PreviousFields
  const prevAmount = prev && prev.MPTAmount ? prev.MPTAmount : '0'
  const finalAmount = final.MPTAmount ?? '0'

  return {
    previousBalance: convertHexToBigInt(prevAmount),
    finalBalance: convertHexToBigInt(finalAmount),
    account: final.Account,
    change: convertHexToBigInt(finalAmount) - convertHexToBigInt(prevAmount),
  }
}

export const computeMPTIssuanceBalanceChange = (node) => {
  const final = node.FinalFields || node.NewFields
  const prev = node.PreviousFields
  const prevAmount =
    prev && prev.OutstandingAmount ? prev.OutstandingAmount : '0'
  const finalAmount = final.OutstandingAmount ?? '0'

  return {
    previousBalance: convertHexToBigInt(prevAmount),
    finalBalance: convertHexToBigInt(finalAmount),
    account: final.Issuer,
    change: convertHexToBigInt(finalAmount) - convertHexToBigInt(prevAmount),
  }
}

export const renderXRP = (d, language) => {
  const options = { ...CURRENCY_OPTIONS, currency: 'XRP' }
  return localizeNumber(d, language, options)
}
