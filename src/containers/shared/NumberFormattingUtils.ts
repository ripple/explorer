import { localizeNumber } from './utils'

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
 * Formats USD prices with tiered precision based on value
 * @param price - The USD price to format
 * @param lang - Language for localization
 * @returns Formatted USD price string or '--' for zero prices
 */
export const formatUsdPrice = (price: number, lang: string): string => {
  if (price === 0) {
    return '--'
  }

  let options
  if (price >= 1) {
    options = USD_CURRENCY_OPTIONS
  } else if (price >= 0.0001) {
    options = USD_SMALL_BALANCE_CURRENCY_OPTIONS
  } else {
    options = USD_EXTRA_SMALL_BALANCE_CURRENCY_OPTIONS
  }

  return localizeNumber(price, lang, options) || '--'
}

/**
 * Formats USD balances with tiered precision based on value
 * @param balance - The USD balance to format
 * @param lang - Language for localization
 * @returns Formatted USD balance string or '--' for zero balances
 */
export const formatUsdBalance = (balance: number, lang: string): string => {
  if (balance === 0) {
    return '--'
  }

  let options
  if (balance >= 1) {
    options = USD_CURRENCY_OPTIONS
  } else if (balance >= 0.0001) {
    options = USD_SMALL_BALANCE_CURRENCY_OPTIONS
  } else {
    options = USD_EXTRA_SMALL_BALANCE_CURRENCY_OPTIONS
  }

  return localizeNumber(balance, lang, options) || '--'
}

/**
 * Formats token balances with conditional precision based on value
 * @param balance - The token balance to format
 * @param lang - Language for localization
 * @returns Formatted balance string
 */
export const formatTokenBalance = (balance: number, lang: string): string => {
  const options = balance > 999 ? NUMBER_DEFAULT_OPTIONS : NUMBER_SMALL_OPTIONS
  return localizeNumber(balance, lang, options) || '0'
}

/**
 * Three-step calculation for USD balance to ensure mathematical consistency
 * Formats USD price, formats token balance, then calculates USD balance using displayed values
 * @param tokenBalance - The token balance
 * @param priceInXrp - Price in XRP
 * @param xrpToUsdRate - XRP to USD conversion rate
 * @param lang - Language for localization
 * @returns Object with formatted USD price, token balance, and calculated USD balance
 */
export const calculateFormattedUsdBalance = (
  tokenBalance: number,
  priceInXrp: number,
  xrpToUsdRate: number,
  lang: string,
): {
  formattedUsdPrice: string
  formattedBalance: string
  formattedBalanceUsd: string
} => {
  let formattedUsdPrice = '--'
  let formattedBalance = '--'
  let formattedBalanceUsd = '--'

  if (priceInXrp !== 0) {
    // Step 1: Format USD Price
    const rawUsdPrice = priceInXrp * xrpToUsdRate
    formattedUsdPrice = formatUsdPrice(rawUsdPrice, lang)
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
    formattedBalanceUsd = formatUsdBalance(calculatedBalanceUSD, lang)
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
