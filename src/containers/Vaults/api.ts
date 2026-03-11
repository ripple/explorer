import axios from 'axios'
import type { VaultData } from './types'

export interface VaultsMetrics {
  tvl_total: number
  debt_total: number
  active_vaults: number
  avg_interest_rate: number
  utilization_ratio: number
  loans_originated: number
  last_updated: string
}

export interface VaultsListResponse {
  total: number
  page: number
  size: number
  sort_by: string
  sort_order: string
  asset_type: string
  results: VaultData[]
}

// Maps frontend sort field names to API sort_by param values
const SORT_FIELD_MAP: Record<string, string> = {
  tvl_usd: 'assets_total',
  outstanding_loans_usd: 'outstanding_loans',
  avg_interest_rate: 'average_interest_rate',
  utilization_ratio: 'utilization_ratio',
}

// Maps frontend filter keys to API asset_type param values
const ASSET_TYPE_MAP: Record<string, string> = {
  '': 'all',
  xrp: 'xrp',
  stablecoin: 'stablecoins',
}

export const fetchVaultsList = (params: {
  page: number
  size: number
  sortField: string
  sortOrder: 'asc' | 'desc'
  assetType: string
  searchQuery: string
}): Promise<VaultsListResponse> => {
  const queryParams = new URLSearchParams({
    page: params.page.toString(),
    size: params.size.toString(),
    sort_order: params.sortOrder,
  })

  const apiSortBy = SORT_FIELD_MAP[params.sortField]
  if (apiSortBy) {
    queryParams.set('sort_by', apiSortBy)
  }

  const apiAssetType = ASSET_TYPE_MAP[params.assetType] ?? 'all'
  if (apiAssetType !== 'all') {
    queryParams.set('asset_type', apiAssetType)
  }

  if (params.searchQuery.trim()) {
    queryParams.set('name_like', params.searchQuery.trim())
  }

  return axios
    .get(`${process.env.VITE_LOS_URL}/vaults?${queryParams.toString()}`)
    .then((resp) => resp.data)
}

export const fetchVaultsAggregateStats = (): Promise<VaultsMetrics> =>
  axios
    .get(`${process.env.VITE_LOS_URL}/vaults/aggregate-statistics`)
    .then((resp) => resp.data)
