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
export const FETCH_INTERVAL_XRP_USD_ORACLE_MILLIS = 60 * 1000 // 1 minute
export const FETCH_INTERVAL_FEE_SETTINGS_MILLIS = 10 * 60 * 1000 // 10 minutes

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

export const DROPS_TO_XRP_FACTOR = 1000000.0

export const ONE_TENTH_BASIS_POINT = 1000
export const ONE_TENTH_BASIS_POINT_DIGITS = 3
export const ONE_TENTH_BASIS_POINT_CUTOFF = 0.001

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

export const ORACLE_ACCOUNT = 'rXUMMaPpZqPutoRszR29jtC8amWq3APkx'

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

export const isValidJsonString = (str) => {
  try {
    JSON.parse(str)
    return true
  } catch (e) {
    return false
  }
}

// Document: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat
export const localizeNumber = (
  num,
  lang = 'en-US',
  options = {},
  isMPT = false,
) => {
  const number = Number.parseFloat(num)
  const config = { ...NUMBER_DEFAULT_OPTIONS, ...options }

  if (Number.isNaN(number)) {
    return null
  }
  if (config.style === 'currency' && !isMPT) {
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

/**
 * Formats small numbers (< 1) with 4 decimal places, showing trailing zeros
 * @param value - The numeric value to format (should be < 1)
 * @param lang - Language for localization
 * @returns Formatted string with 4 decimal places
 */
export const formatSmallNumber = (value, lang = 'en-US', digits = 4) => {
  if (value === 0)
    return localizeNumber(0, lang, {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    })
  if (value < 0.0001) return '< 0.0001'
  return localizeNumber(value, lang, {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })
}

export const formatLargeNumber = (d = 0, digits = 1, lang = 'en-US') => {
  // For numbers >= 10,000 (5 digits), use abbreviations with 1 decimal place
  if (d >= 10000) {
    if (d >= QUADRILLION) {
      return {
        num: localizeNumber(d / QUADRILLION, lang, {
          minimumFractionDigits: digits,
          maximumFractionDigits: digits,
        }),
        unit: 'Q',
      }
    }

    if (d >= TRILLION) {
      return {
        num: localizeNumber(d / TRILLION, lang, {
          minimumFractionDigits: digits,
          maximumFractionDigits: digits,
        }),
        unit: 'T',
      }
    }

    if (d >= BILLION) {
      return {
        num: localizeNumber(d / BILLION, lang, {
          minimumFractionDigits: digits,
          maximumFractionDigits: digits,
        }),
        unit: 'B',
      }
    }

    if (d >= MILLION) {
      return {
        num: localizeNumber(d / MILLION, lang, {
          minimumFractionDigits: digits,
          maximumFractionDigits: digits,
        }),
        unit: 'M',
      }
    }

    if (d >= THOUSAND) {
      return {
        num: localizeNumber(d / THOUSAND, lang, {
          minimumFractionDigits: digits,
          maximumFractionDigits: digits,
        }),
        unit: 'K',
      }
    }
  }

  // For numbers < 10,000 (less than 5 digits), show full number with 2 decimal places and commas
  if (d >= 1) {
    return {
      num: localizeNumber(d, lang, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      unit: '',
    }
  }

  // For numbers < 1, this should not be used (use formatSmallNumber instead)
  // But keeping legacy behavior for compatibility
  let variableDigits = digits
  let numberOfZeros = 0
  let numberCopy = d

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

/**
 * Converts a duration in seconds to a human-readable format with multiple time units.
 *
 * This function breaks down a duration into its constituent time units (years, months, days,
 * hours, minutes, seconds) and formats them in a compact, dot-separated format.
 *
 * @param {number} totalSeconds - The duration in seconds to convert
 * @param {number} maxUnits - Maximum number of time units to include in the output (default: 4)
 * @returns {string} A formatted duration string (e.g., "1d.2hr.30min.15s")
 *
 * @example
 * formatDurationDetailed(3665) // Returns "1hr.1min.5s"
 * formatDurationDetailed(90061) // Returns "1d.1hr.1min.1s"
 * formatDurationDetailed(90061, 2) // Returns "1d.1hr" (limited to 2 units)
 * formatDurationDetailed(0) // Returns "0s"
 */
export const formatDurationDetailed = (totalSeconds, maxUnits = 4) => {
  const seconds = Math.abs(totalSeconds)
  const units = []

  // Define time units in descending order
  const timeUnits = [
    { name: 'yr', value: 365 * 24 * 60 * 60 },
    { name: 'mo', value: 30.44 * 24 * 60 * 60 }, // Average month length
    { name: 'd', value: 24 * 60 * 60 },
    { name: 'hr', value: 60 * 60 },
    { name: 'min', value: 60 },
    { name: 's', value: 1 },
  ]

  let remaining = Math.floor(seconds)

  for (const unit of timeUnits) {
    if (remaining >= unit.value && units.length < maxUnits) {
      const count = Math.floor(remaining / unit.value)
      if (count > 0) {
        units.push(`${count}${unit.name}`)
        remaining -= count * unit.value
      }
    }
  }

  // If no units were added (e.g., 0 seconds), return "0s"
  if (units.length === 0) {
    return '0s'
  }

  return units.join('.')
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
    previousBalance: BigInt(prevAmount),
    finalBalance: BigInt(finalAmount),
    account: final.Account,
    change: BigInt(finalAmount) - BigInt(prevAmount),
  }
}

export const computeMPTIssuanceBalanceChange = (node) => {
  const final = node.FinalFields || node.NewFields
  const prev = node.PreviousFields
  const prevAmount =
    prev && prev.OutstandingAmount ? prev.OutstandingAmount : '0'
  const finalAmount = final.OutstandingAmount ?? '0'

  return {
    previousBalance: BigInt(prevAmount),
    finalBalance: BigInt(finalAmount),
    account: final.Issuer,
    change: BigInt(finalAmount) - BigInt(prevAmount),
  }
}

export const renderXRP = (d, language) => {
  const options = { ...CURRENCY_OPTIONS, currency: 'XRP' }
  return localizeNumber(d, language, options)
}

/**
 * Converts a scaled integer to a its original value and return it as a string.
 * Formula: originalPrice = assetPrice / 10^scale
 *
 * @param {string | number | bigint} assetPrice - The scaled value.
 *   - string: interpreted as hex (for Price Oracles - XLS-0047)
 *   - number: interpreted as decimal
 *   - bigint: interpreted as decimal (for MPT amounts, which can be > Number.MAX_SAFE_INTEGER)
 * @param {number} scale - The number of decimal places.
 * @returns {string} The formatted decimal string.
 *
 * @example
 * convertScaledPrice("5f5e100", 6)  // "100" (hex string from Oracle)
 * convertScaledPrice(1000000, 6)    // "1" (number from MPT)
 *
 * @see https://github.com/XRPLF/XRPL-Standards/tree/master/XLS-0047-PriceOracles
 */
export function convertScaledPrice(assetPrice, scale) {
  const scaledPriceInBigInt =
    typeof assetPrice === 'string'
      ? BigInt(`0x${assetPrice}`)
      : BigInt(assetPrice)

  const divisor = BigInt(10 ** scale)
  const integerPart = scaledPriceInBigInt / divisor
  const remainder = scaledPriceInBigInt % divisor
  const fractionalPart = (remainder * BigInt(10 ** scale)) / divisor
  return fractionalPart > 0
    ? `${integerPart}.${fractionalPart.toString().padStart(scale, '0')}`
    : `${integerPart}`
}

export const shortenAccount = (addr = '') =>
  addr.length > 12 ? `${addr.slice(0, 7)}...${addr.slice(-5)}` : addr

export const stripHttpProtocol = (url = '') => url.replace(/^https?:\/\//, '')

export const shortenDomain = (
  domain = '',
  prefixLength = 15,
  suffixLength = 11,
) =>
  domain.length > prefixLength + suffixLength
    ? `${domain.slice(0, prefixLength)}...${domain.slice(-suffixLength)}`
    : domain

export const shortenNFTTokenID = (nftTokenID = '') =>
  nftTokenID.length > 20
    ? `${nftTokenID.slice(0, 10)}...${nftTokenID.slice(-10)}`
    : nftTokenID

export const shortenMPTID = (
  mptTokenID = '',
  prefixLength = 10,
  suffixLength = 10,
) =>
  mptTokenID.length > prefixLength + suffixLength
    ? `${mptTokenID.slice(0, prefixLength)}...${mptTokenID.slice(-suffixLength)}`
    : mptTokenID

export const shortenTxHash = (txHash = '') =>
  txHash.length > 12 ? `${txHash.slice(0, 6)}...${txHash.slice(-6)}` : txHash

export const shortenLoanBrokerID = (loanBrokerID = '') =>
  loanBrokerID.length > 12
    ? `${loanBrokerID.slice(0, 6)}...${loanBrokerID.slice(-6)}`
    : loanBrokerID

export const shortenLoanID = (loanID = '') =>
  loanID.length > 12 ? `${loanID.slice(0, 6)}...${loanID.slice(-6)}` : loanID

/**
 * Converts URLs to HTTP/HTTPS format, handling IPFS URLs and plain domains
 * @param {string} url - The URL to convert (can be ipfs://, https://, http://, or plain domain)
 * @returns {string} The converted HTTP/HTTPS URL
 */
export const convertToHttpURL = (url) => {
  if (!url) {
    return url
  }

  // Handle IPFS URLs - convert to HTTP
  if (url.startsWith('ipfs://')) {
    return url.replace('ipfs://', 'https://ipfs.io/ipfs/')
  }

  // Matches a protocol (e.g. 'http://' or 'https://') at the start of a string
  const PROTOCOL_REGEX = /^([a-z][a-z0-9+\-.]*):\/\//

  // If URL already has a protocol, return as is
  if (PROTOCOL_REGEX.test(url)) {
    return url
  }

  // Otherwise, assume it's a plain domain and add https://
  return `https://${url}`
}

/**
 * Truncates the vaultID to ensure better readability
 * @param {string} vaultID - The complete VaultID obtained from XRPL on-chain data
 * @returns {string} The truncated VaultID
 */
export const shortenVaultID = (vaultID) =>
  `${vaultID.substring(0, 8)}...${vaultID.substring(vaultID.length - 6)}`
