import { localizeNumber } from './utils'

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
