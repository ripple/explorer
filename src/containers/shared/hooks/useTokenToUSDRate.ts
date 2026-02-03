import { useQuery } from 'react-query'
import { useXRPToUSDRate } from './useXRPToUSDRate'
import Log from '../log'

const FETCH_INTERVAL_MILLIS = 60 * 1000 // 1 minute

/**
 * Fetches token price from LOS API
 * The API returns the price of the token in XRP
 */
const fetchTokenPriceInXRP = async (
  currency: string,
  issuer: string,
): Promise<number> => {
  const response = await fetch(
    `${process.env.VITE_LOS_URL}/tokens/${currency}.${issuer}`,
  )

  if (!response.ok) {
    throw new Error(`Failed to fetch token price: ${response.statusText}`)
  }

  const data = await response.json()
  return Number(data?.price) || 0
}

interface TokenInfo {
  currency: string
  issuer?: string
}

interface TokenToUSDRateResult {
  rate: number
  isAvailable: boolean
  isLoading: boolean
}

/**
 * Returns the current exchange rate for a token to USD.
 * First fetches the token price in XRP from LOS API,
 * then converts to USD using the XRP to USD rate.
 *
 * @param token - The token info containing currency and optional issuer
 * @returns Object containing the USD rate, availability status, and loading state
 */
export function useTokenToUSDRate(
  token: TokenInfo | undefined,
): TokenToUSDRateResult {
  const xrpToUsdRate = useXRPToUSDRate()
  const isMainnet = process.env.VITE_ENVIRONMENT === 'mainnet'

  const currency = token?.currency
  const issuer = token?.issuer

  // Only fetch for non-XRP, non-RLUSD tokens with an issuer on mainnet
  const shouldFetch =
    isMainnet &&
    !!currency &&
    currency !== 'XRP' &&
    currency !== 'RLUSD' &&
    !!issuer

  const {
    data: priceInXRP,
    isLoading,
    isFetched,
  } = useQuery(
    ['tokenPriceInXRP', currency, issuer],
    () => fetchTokenPriceInXRP(currency!, issuer!),
    {
      enabled: shouldFetch,
      refetchInterval: FETCH_INTERVAL_MILLIS,
      staleTime: FETCH_INTERVAL_MILLIS,
      onError: (error) => Log.error(error),
    },
  )

  // XRP: use direct XRP to USD rate
  if (currency === 'XRP') {
    return { rate: xrpToUsdRate, isAvailable: true, isLoading: false }
  }

  // RLUSD: stablecoin pegged 1:1 with USD
  if (currency === 'RLUSD') {
    return { rate: 1, isAvailable: true, isLoading: false }
  }

  // For non-mainnet, return a mock rate for testing
  if (!isMainnet && currency && issuer) {
    return { rate: 1.5, isAvailable: true, isLoading: false }
  }

  // For tokens that need API fetch
  if (shouldFetch) {
    // Still loading
    if (isLoading || !isFetched) {
      return { rate: 0, isAvailable: false, isLoading: true }
    }

    // Fetched successfully with a valid price
    if (priceInXRP && priceInXRP > 0) {
      return {
        rate: priceInXRP * xrpToUsdRate,
        isAvailable: true,
        isLoading: false,
      }
    }

    // Fetched but no price available
    return { rate: 0, isAvailable: false, isLoading: false }
  }

  // No conversion available (e.g., token without issuer on mainnet)
  return { rate: 0, isAvailable: false, isLoading: false }
}
