export interface XRPLMetaToken {
  index?: number
  currency: string
  issuer: string
  meta: {
    token: {
      name?: string
      description?: string
      icon?: string
      trust_level?: number
      asset_class?: 'fiat' | 'commodity' | 'equity' | 'cryptocurrency'
      weblinks?: XRPLMetaWeblink[]
    }
    issuer: {
      name?: string
      description?: string
      icon?: string
      kyc?: boolean
      trust_level?: number
      weblinks?: XRPLMetaWeblink[]
    }
  }
  metrics: {
    trustlines?: number
    holders?: number
    supply?: string
    marketcap?: string
    price?: string
    volume_24h?: string
    volume_7d?: string
    exchanges_24h?: number
    exchanges_7d?: number
    takers_24h?: number
    takers_7d?: number
    changes?: {
      '24h'?: XRPLMetaChangePeriod
      '7d'?: XRPLMetaChangePeriod
    }
  }
}

export interface XRPLMetaWeblink {
  url?: string
  type?:
    | 'website'
    | 'socialmedia'
    | 'support'
    | 'sourcecode'
    | 'whitepaper'
    | 'audit'
    | 'report'
  title?: string
}

export interface XRPLMetaChangePeriod {
  trustlines?: XRPLMetaDelta
  holders?: XRPLMetaDelta
  supply?: XRPLMetaDeltaString
  marketcap?: XRPLMetaDelta
  price?: XRPLMetaPercentOnly
}

export interface XRPLMetaDelta {
  delta?: number
  percent?: number
}

export interface XRPLMetaDeltaString {
  delta?: string
  percent?: number
}

export interface XRPLMetaPercentOnly {
  percent?: number
}
