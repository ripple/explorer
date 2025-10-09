import { formatPrice } from '../../shared/utils'
import { TokenHoldersData } from '../../../rippled/holders'
import { LOSToken } from '../../shared/losTypes'

const DEFAULT_DECIMALS = 1

/**
 * Formats a number to a specified number of decimal places
 */
const formatDecimals = (
  val: number,
  decimals: number = DEFAULT_DECIMALS,
): string => {
  const rounded = Number(val.toFixed(decimals))

  if (rounded === 0 && val !== 0) {
    const str = val.toPrecision(1)
    return str.includes('e') ? '< 0.1' : str
  }

  return rounded.toString()
}

/**
 * Calculates the circulating supply from holders data or token supply
 */
export const calculateCirculatingSupply = (
  holdersData: TokenHoldersData | undefined,
  tokenData: LOSToken,
): number => {
  return holdersData?.totalSupply || Number(tokenData.supply) || 0
}

/**
 * Calculates market cap in USD
 */
export const calculateMarketCap = (
  circulatingSupply: number,
  price: string,
  xrpUSDRate: string,
): number => {
  return Number(circulatingSupply) * Number(price) * Number(xrpUSDRate)
}

/**
 * Formats circulating supply for display
 */
export const formatCirculatingSupply = (circulatingSupply: number): string => {
  return Number(formatDecimals(circulatingSupply, 2)).toLocaleString()
}

/**
 * Formats market cap for display with currency symbol
 */
export const formatMarketCap = (marketCap: number): string => {
  return formatPrice(marketCap)
}

/**
 * Truncates a string (typically addresses) for display
 */
export const truncateString = (
  address: string,
  startLength: number = 6,
  endLength: number = 6,
): string => {
  if (!address || address.length <= startLength + endLength) {
    return address
  }
  return `${address.slice(0, startLength)}...${address.slice(-endLength)}`
}

/**
 * Checks if loading state should show spinner for market data
 */
export const shouldShowLoadingSpinner = (
  isLoading: boolean | undefined,
  value: string | number | undefined,
): boolean => {
  return !!isLoading || !value || value === ''
}

/**
 * Validates if token data is complete for calculations
 */
export const isTokenDataComplete = (
  tokenData: LOSToken | undefined,
  holdersData: TokenHoldersData | undefined,
): boolean => {
  return !!(tokenData && (holdersData?.totalSupply || tokenData.supply))
}

/**
 * Calculates AMM TVL in USD
 */
export const calculateAmmTvl = (
  ammAmount: number,
  dropsToXrpFactor: number,
  xrpUSDPrice: number,
): number => {
  return (ammAmount / dropsToXrpFactor) * xrpUSDPrice * 2
}
