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
  'tvl-usd': 'assets_total',
  'outstanding-loans-usd': 'outstanding_loans',
  'avg-interest-rate': 'average_interest_rate',
  'utilization-ratio': 'utilization_ratio',
}

// Maps frontend filter keys to API asset_type param values
const ASSET_TYPE_MAP: Record<string, string> = {
  '': 'all',
  xrp: 'xrp',
  stablecoin: 'stablecoins',
}

// Maps raw API vault object to frontend VaultData shape
const mapVault = (raw: any): VaultData => ({
  vault_id: raw.vault_id,
  name: raw.name,
  asset_currency: raw.asset_currency,
  asset_issuer: raw.asset_issuer,
  asset_issuer_name: raw.asset_issuer_name,
  tvl_usd: raw.assets_total,
  outstanding_loans_usd: raw.outstanding_loans,
  utilization_ratio: raw.utilization_ratio,
  avg_interest_rate: raw.average_interest_rate,
  website: raw.website,
  asset_category: raw.asset_category,
})

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

  return axios.get(`/api/v1/vaults?${queryParams.toString()}`).then((resp) => {
    const { data } = resp
    return {
      ...data,
      results: (data.results || []).map(mapVault),
    }
  })
}

export const fetchVaultsAggregateStats = (): Promise<VaultsMetrics> =>
  axios.get('/api/v1/vaults/aggregate-statistics').then((resp) => resp.data)

export interface AssetPricesResponse {
  prices: Record<string, number> // "currency.issuer" → XRP price
  lastUpdated: number | null
}

export const fetchVaultAssetPrices = (): Promise<AssetPricesResponse> =>
  axios.get('/api/v1/vaults/asset-prices').then((resp) => resp.data)
