import axios from 'axios'

export interface AMMPool {
  amm_account_id: string
  currency_1: string
  issuer_1?: string
  currency_2: string
  issuer_2?: string
  tvl_xrp: number
  tvl_usd: number
  trading_volume_xrp: number
  trading_volume_usd: number
  fees_collected_xrp: number
  fees_collected_usd: number
  annual_percentage_return: number
  liquidity_provider_count: number
  amm_created_timestamp: string
  asset_class_1?: string
  asset_class_2?: string
  // Token icons (fetched separately from LOS)
  icon_1?: string
  icon_2?: string
}

export interface AMMRankingsResponse {
  size: number
  sort_field: string
  sort_order: string
  count: number
  results: AMMPool[]
}

export interface AggregatedStats {
  tvl_xrp: number
  tvl_usd: number
  amm_pool_count: number
  liquidity_provider_count: number
  trading_volume_xrp: number
  trading_volume_usd: number
}

export interface HistoricalDataPoint {
  date: string
  tvl_xrp: number
  tvl_usd: number
  trading_volume_xrp: number
  trading_volume_usd: number
}

export interface HistoricalTrendsResponse {
  amm_account_id: string
  time_range?: string
  start_date?: string
  total_data_points: number
  data_points: HistoricalDataPoint[]
}

/**
 * Fetch token icon from LOS for a single token via Express proxy
 */
const fetchTokenIcon = async (currency: string, issuer: string): Promise<string | undefined> => {
  try {
    const response = await axios.get(`/api/v1/tokens/${currency}.${issuer}`)
    return response.data?.icon
  } catch (error) {
    // Silently fail - icon is optional
    return undefined
  }
}

/**
 * Helper function to delay execution
 */
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * Fetch token icons for AMM pools
 * Fetches icons individually from LOS API with chunking and delays to avoid rate limits
 */
const fetchTokenIcons = async (tokenIds: string[]): Promise<Record<string, string>> => {
  if (tokenIds.length === 0) {
    return {}
  }

  const iconMap: Record<string, string> = {}
  const CHUNK_SIZE = 5 // Process 5 tokens at a time to avoid rate limits
  const DELAY_BETWEEN_CHUNKS = 200 // 200ms delay between chunks

  // Process tokens in chunks to avoid overwhelming the API
  for (let i = 0; i < tokenIds.length; i += CHUNK_SIZE) {
    const chunk = tokenIds.slice(i, i + CHUNK_SIZE)
    const promises = chunk.map(async (tokenId) => {
      const [currency, issuer] = tokenId.split('.')
      if (currency && issuer) {
        const icon = await fetchTokenIcon(currency, issuer)
        if (icon) {
          iconMap[tokenId] = icon
        }
      }
    })
    await Promise.all(promises)

    // Add delay between chunks to avoid rate limiting (except for the last chunk)
    if (i + CHUNK_SIZE < tokenIds.length) {
      await delay(DELAY_BETWEEN_CHUNKS)
    }
  }

  return iconMap
}

/**
 * Fetch AMM rankings (top 1000 AMMs)
 * Icons are NOT fetched here - they are fetched separately per page
 */
export const fetchAMMRankings = async (
  sortField: string = 'tvl_usd',
  sortOrder: 'asc' | 'desc' = 'desc',
): Promise<AMMRankingsResponse> => {
  try {
    const response = await axios.get('/api/v1/amms', {
      params: {
        size: 1000,
        sort_field: sortField,
        sort_order: sortOrder,
      },
    })

    return response.data
  } catch (error) {
    console.error('Failed to fetch AMM rankings:', error)
    throw error
  }
}

/**
 * Fetch token icons for a specific set of AMMs (e.g., one page)
 * This allows lazy loading of icons only when needed
 */
export const fetchIconsForAMMs = async (amms: AMMPool[]): Promise<Record<string, string>> => {
  // Collect unique currency-issuer pairs from the provided AMMs
  // Key insight: currency_1 pairs with issuer_1, currency_2 pairs with issuer_2
  const tokenPairs = new Set<string>()

  amms.forEach((amm: AMMPool) => {
    // For currency_1, use issuer_1 (not issuer_2)
    if (amm.currency_1 && amm.issuer_1 && amm.currency_1 !== 'XRP') {
      tokenPairs.add(`${amm.currency_1}.${amm.issuer_1}`)
    }
    // For currency_2, use issuer_2 (not issuer_1)
    if (amm.currency_2 && amm.issuer_2 && amm.currency_2 !== 'XRP') {
      tokenPairs.add(`${amm.currency_2}.${amm.issuer_2}`)
    }
  })

  return fetchTokenIcons(Array.from(tokenPairs))
}

/**
 * Fetch aggregated AMM statistics
 */
export const fetchAggregatedStats = async (): Promise<AggregatedStats> => {
  const response = await axios.get('/api/v1/amms/aggregated')
  return response.data
}

/**
 * Fetch historical trends for aggregated AMM data
 */
export const fetchHistoricalTrends = async (
  timeRange: string = '6M',
): Promise<HistoricalTrendsResponse> => {
  const response = await axios.get('/api/v1/amms/historical-trends', {
    params: {
      amm_account_id: 'aggregated',
      time_range: timeRange,
    },
  })
  return response.data
}

/**
 * Fetch historical trends for a specific AMM pool
 */
export const fetchAMMHistoricalTrends = async (
  ammAccountId: string,
  timeRange: string = '6M',
): Promise<HistoricalTrendsResponse> => {
  const response = await axios.get('/api/v1/amms/historical-trends', {
    params: {
      amm_account_id: ammAccountId,
      time_range: timeRange,
    },
  })
  return response.data
}

