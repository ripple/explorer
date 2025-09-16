interface SocialLink {
  type: string
  url: string
}
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
  social_links?: SocialLink[]
  trustlines: number
  transfer_fee?: number
  issuer_domain?: string
  issuer_name?: string
  tvl_xrp?: number
  tvl_usd?: string
  market_cap?: string
  market_cap_usd?: string
  holders?: number
  circ_supply?: string
  daily_volume?: string
  daily_volume_usd?: string
  supply?: string
  trust_level?: number
  price?: string
  price_usd?: string
  index: number
}
