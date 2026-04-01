export interface VaultData {
  vault_id: string
  name: string
  asset_currency: string
  asset_issuer: string
  asset_issuer_name: string
  tvl_usd: number
  outstanding_loans_usd: number
  utilization_ratio: number
  avg_interest_rate: number
  website: string
  asset_category: string
}

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

export interface AssetPricesResponse {
  prices: Record<string, number> // "currency.issuer" → XRP price
  lastUpdated: number | null
}
