import { localizeNumber, formatLargeNumber, formatSmallNumber } from './utils'

/**
 * Thresholds for determining formatting precision.
 * Adjust these values as needed to match product or UX requirements.
 */
const USD_REGULAR_BALANCE_LOWER_BOUND = 1
const USD_SMALL_BALANCE_LOWER_BOUND = 0.0001
const TOKEN_BALANCE_LARGE_LOWER_BOUND = 999

// Standard display for most XRP amounts (2 decimals)
export const XRP_CURRENCY_OPTIONS = {
  style: 'currency',
  currency: 'XRP',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
}

// Higher precision for small (<1 XRP) balances
export const XRP_SMALL_BALANCE_CURRENCY_OPTIONS = {
  style: 'currency',
  currency: 'XRP',
  minimumFractionDigits: 2,
  maximumFractionDigits: 4,
}

export const USD_CURRENCY_OPTIONS = {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
}

// Higher precision for small (<1 USD) balances
export const USD_SMALL_BALANCE_CURRENCY_OPTIONS = {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 4,
}

// Higher precision for small (<0.0001 USD) balances
export const USD_EXTRA_SMALL_BALANCE_CURRENCY_OPTIONS = {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 10,
}

export const NUMBER_DEFAULT_OPTIONS = {
  style: 'decimal',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
  useGrouping: true,
}

export const NUMBER_SMALL_OPTIONS = {
  style: 'decimal',
  minimumFractionDigits: 0,
  maximumFractionDigits: 4,
  useGrouping: true,
}

/**
 * Formats USD values (price or balance) with tiered precision based on value
 * @param value - The USD value to format
 * @param lang - Language for localization
 * @returns Formatted USD string or '--' for zero values
 */
export const formatUsdValue = (value: number, lang: string): string => {
  if (value === 0) {
    return '--'
  }

  let options
  if (value >= USD_REGULAR_BALANCE_LOWER_BOUND) {
    options = USD_CURRENCY_OPTIONS
  } else if (value >= USD_SMALL_BALANCE_LOWER_BOUND) {
    options = USD_SMALL_BALANCE_CURRENCY_OPTIONS
  } else {
    options = USD_EXTRA_SMALL_BALANCE_CURRENCY_OPTIONS
  }

  return localizeNumber(value, lang, options) || '--'
}

/**
 * Formats token balances with conditional precision based on value
 * @param balance - The token balance to format
 * @param lang - Language for localization
 * @returns Formatted balance string
 */
export const formatTokenBalance = (balance: number, lang: string): string => {
  const options =
    balance > TOKEN_BALANCE_LARGE_LOWER_BOUND
      ? NUMBER_DEFAULT_OPTIONS
      : NUMBER_SMALL_OPTIONS
  return localizeNumber(balance, lang, options) || '0'
}

/**
 * Three-step calculation for USD balance to ensure mathematical consistency
 * Formats USD price, formats token balance, then calculates USD balance using displayed values
 * @param tokenBalance - The token balance
 * @param priceInUSD - Price in USD
 * @param lang - Language for localization
 * @returns Object with formatted USD price, token balance, and calculated USD balance
 */
export const calculateFormattedUsdBalance = (
  tokenBalance: number,
  priceInUSD: number,
  lang: string,
): {
  formattedUsdPrice: string
  formattedBalance: string
  formattedBalanceUsd: string
} => {
  let formattedUsdPrice = '--'
  let formattedBalance = '--'
  let formattedBalanceUsd = '--'

  if (priceInUSD !== 0) {
    // Step 1: Format USD Price
    formattedUsdPrice = formatUsdValue(priceInUSD, lang)
    const displayedUsdPrice = parseFloat(
      (formattedUsdPrice || '0').replace(/[$,]/g, ''), // Removes dollar signs and commas from USD prices like "$4,321.30" → "4321.30"
    )

    // Step 2: Format Balance
    formattedBalance = formatTokenBalance(tokenBalance, lang)
    const displayedBalance = parseFloat(
      (formattedBalance || '0').replace(/[,]/g, ''), // Removes commas from token balances like "1,234.5678" → "1234.5678"
    )

    // Step 3: Calculate USD Balance using displayed values
    const calculatedBalanceUSD = displayedUsdPrice * displayedBalance
    formattedBalanceUsd = formatUsdValue(calculatedBalanceUSD, lang)
  } else {
    // If no price, still format the balance
    formattedBalance = formatTokenBalance(tokenBalance, lang)
  }

  return {
    formattedUsdPrice,
    formattedBalance,
    formattedBalanceUsd,
  }
}

/**
 * Formats numbers according to the general rules:
 * - Small numbers (< 1): 4 decimal places with trailing zeros
 * - Large numbers (>= 10,000): abbreviate with 1 decimal place and suffix (K, M, B)
 * - Medium numbers (1 to 9,999): full number with 2 decimal places and commas
 * @param value - The numeric value to format
 * @param decimals - Number of decimal places for abbreviated numbers (default: 1)
 * @param lang - Language for localization (default: 'en-US')
 * @returns Formatted string
 */
export const parseAmount = (
  value: string | number,
  decimals: number = 1,
  lang: string = 'en-US',
): string => {
  const valueNumeric = Number(value)

  if (valueNumeric === 0) {
    return (
      localizeNumber(0, lang, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }) || '0.00'
    )
  }

  if (valueNumeric.toString().includes('e')) {
    return '< 0.0001'
  }

  if (valueNumeric > 0 && valueNumeric < 1) {
    return formatSmallNumber(valueNumeric, lang) || '0.0000'
  }

  const formatted = formatLargeNumber(valueNumeric, decimals, lang)
  return formatted.unit
    ? `${formatted.num || '0'}${formatted.unit}`
    : formatted.num || '0'
}

/**
 * Formats currency amounts with dollar sign prefix
 * @param value - The numeric value to format as currency
 * @param decimals - Number of decimal places for abbreviated numbers (default: 1)
 * @returns Formatted currency string with $ prefix
 */
export const parseCurrencyAmount = (
  value: string | number,
  decimals: number = 1,
  lang: string = 'en-US',
): string => {
  const formatted = parseAmount(value, decimals, lang)

  if (formatted === '< 0.0001') {
    return '<\u00A0$0.0001'
  }

  return `$${formatted}`
}

/**
 * Formats integer values with 0 decimal places
 * @param value - The numeric value to format as integer
 * @param lang - Language for localization (default: 'en-US')
 * @returns Formatted integer string with commas for thousands separators
 */
export const parseIntegerAmount = (
  value: string | number,
  lang: string = 'en-US',
): string => {
  const valueNumeric = Number(value)

  if (valueNumeric === 0) {
    return '0'
  }

  // For large numbers (>= 10,000), use abbreviations with 1 decimal place
  if (valueNumeric >= 10000) {
    const formatted = formatLargeNumber(valueNumeric, 1, lang)
    return formatted.unit
      ? `${formatted.num || '0'}${formatted.unit}`
      : formatted.num || '0'
  }

  // For smaller numbers, show full integer with commas
  return (
    localizeNumber(Math.round(valueNumeric), lang, { useGrouping: true }) ||
    Math.round(valueNumeric).toString()
  )
}

/**
 * Formats price values with special rules:
 * - For prices >= $10,000: no decimal places
 * - For very large prices (>= $1,000,000): abbreviate with 2 decimal places
 * - Otherwise: use standard currency formatting
 * @param value - The price value to format
 * @param lang - Language for localization (default: 'en-US')
 * @returns Formatted price string with $ prefix
 */
export const parsePrice = (
  value: string | number,
  lang: string = 'en-US',
): string => {
  const valueNumeric = Number(value)

  if (valueNumeric === 0) {
    return `$${localizeNumber(0, lang, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}`
  }

  if (valueNumeric > 0 && valueNumeric < 0.0001) {
    return '<\u00A0$0.0001'
  }

  if (valueNumeric > 0 && valueNumeric < 1) {
    return `$${formatSmallNumber(valueNumeric, lang) || '0.0000'}`
  }

  if (valueNumeric >= 1000000) {
    const formatted = formatLargeNumber(valueNumeric, 2, lang)
    return `$${formatted.num || '0'}${formatted.unit}`
  }

  if (valueNumeric >= 10000) {
    return `$${localizeNumber(Math.round(valueNumeric), lang, { useGrouping: true }) || Math.round(valueNumeric).toString()}`
  }

  return `$${
    localizeNumber(valueNumeric, lang, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) || valueNumeric.toFixed(2)
  }`
}

/**
 * Formats percentage values with % suffix and 2 decimal places
 * Returns "0.00%" for deviations less than 0.01%
 * @param percent - The percentage value to format
 * @returns Formatted percentage string with % suffix
 */
export const parsePercent = (percent: number, digits = 2): string => {
  // Handle very small percentages
  if (Math.abs(percent) < 0.01) {
    return '0.00%'
  }

  // Use 2 decimal places for percentages
  return `${percent.toFixed(digits)}%`
}
