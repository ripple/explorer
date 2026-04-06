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
  // Trading fee from amm_info RPC (0-1000, where 1000 = 1%)
  trading_fee?: number
  // Token data from LOS /tokens/batch-get (server-cached)
  icon_1?: string
  icon_2?: string
  asset_class_1?: string
  asset_class_2?: string
  asset_subclass_1?: string
  asset_subclass_2?: string
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
 * Fetch AMM rankings (top 1000 AMMs)
 * Icons, asset_class/asset_subclass, and trading_fee are included from server cache
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
