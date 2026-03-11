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
