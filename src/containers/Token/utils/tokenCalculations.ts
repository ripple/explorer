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
 * For stablecoins, doesn't subtract large percentage holders
 */
export const calculateCirculatingSupply = (
  holdersData: TokenHoldersData | undefined,
  tokenData: LOSToken,
): number => {
  let circSupply = holdersData?.totalSupply || Number(tokenData.supply) || 0

  // For stablecoins, don't subtract large percentage holders from circulating supply
  if (tokenData.asset_subclass !== 'stablecoin' && holdersData) {
    let i = 0
    while (holdersData.holders[i] && holdersData.holders[i].percent >= 20) {
      circSupply -= holdersData.holders[i].balance
      i += 1
    }
  }

  return circSupply
}

/**
 * Calculates market cap in USD
 */
export const calculateMarketCap = (
  circulatingSupply: number,
  price: string,
  xrpUSDRate: string,
): number => Number(circulatingSupply) * Number(price) * Number(xrpUSDRate)

/**
 * Formats circulating supply for display
 */
export const formatCirculatingSupply = (circulatingSupply: number): string =>
  Number(formatDecimals(circulatingSupply, 2)).toLocaleString()

/**
 * Checks if loading state should show spinner for market data
 */
export const shouldShowLoadingSpinner = (
  isLoading: boolean | undefined,
  value: string | number | undefined,
): boolean => !!isLoading || !value || value === ''

/**
 * Validates if token data is complete for calculations
 */
export const isTokenDataComplete = (
  tokenData: LOSToken | undefined,
  holdersData: TokenHoldersData | undefined,
): boolean => !!(tokenData && (holdersData?.totalSupply || tokenData.supply))

/**
 * Calculates AMM TVL in USD
 */
export const calculateAmmTvl = (
  ammAmount: number,
  dropsToXrpFactor: number,
  xrpUSDPrice: number,
): number => (ammAmount / dropsToXrpFactor) * xrpUSDPrice * 2
