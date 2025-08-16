export interface LOSToken {
  currency: string
  issuer_account: string
  name?: string
  asset_class?: string
  asset_subclass?: string
  price_change?: number
  daily_trades?: string
  icon?: string
  ttl?: number
  social_links?: string[]
  trustlines: number
  issuer_domain?: string
  issuer_name?: string
  tvl_xrp?: number
  market_cap?: string
  holders?: number
  circ_supply?: string
  daily_volume?: string
  supply?: string
  trust_level?: number
  price?: string
  index: number
}
