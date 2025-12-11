/**
 * Values returned by 'formatAccountInfo' from /src/rippled/lib/utils.js
 */
export interface AccountFormattedInfo {
  accountTransactionID?: string
  sequence?: number
  ticketCount?: number
  ownerCount?: number
  reserve?: number
  tick?: number
  rate?: string
  domain?: string
  emailHash?: string
  flags?: string[]
  balance?: string
  previousTxn?: string
  previousLedger?: number
  nftMinter?: string
}

/**
 * Values returned by 'formatNFTInfo' from /src/rippled/lib/utils.js
 */
export interface NFTFormattedInfo {
  NFTId?: string
  ledgerIndex?: number
  owner?: string
  isBurned?: boolean
  flags?: string[]
  transferFee?: number
  issuer?: string
  NFTTaxon?: number
  NFTSerial?: number
  uri?: string
  validated?: boolean
  status?: string
  warnings?: string[]
}

/**
 * URI entry for XLS-0089 metadata
 * Supports both compact (u, c, t) and long (uri, category, title) field names
 */
export interface MPTMetadataUri {
  // Compact format
  u?: string // uri
  c?: string // category: website, social, docs, other
  t?: string // title
  // Long format (after expansion)
  uri?: string
  category?: string
  title?: string
}

/**
 * Parsed MPT metadata structure conforming to XLS-0089
 * https://github.com/XRPLF/XRPL-Standards/tree/master/XLS-0089-multi-purpose-token-metadata-schema
 *
 * Required fields: ticker (t), name (n), icon (i), asset_class (ac), issuer_name (in)
 * Asset classes: rwa, memes, wrapped, gaming, defi, other
 * Asset subclasses (for rwa): stablecoin, commodity, real_estate, private_credit, equity, treasury, other
 */
export interface MPTMetadata {
  // Short key format (recommended for on-ledger storage)
  t?: string // ticker
  n?: string // name
  d?: string // description
  i?: string // icon URL
  ac?: string // asset_class
  as?: string // asset_subclass (required if ac = rwa)
  in?: string // issuer_name
  us?: MPTMetadataUri[] // uris
  ai?: Record<string, unknown> | string // additional_info

  // Long key format (after decoding/expansion)
  ticker?: string
  name?: string
  desc?: string
  icon?: string
  asset_class?: string
  asset_subclass?: string
  issuer_name?: string
  uris?: MPTMetadataUri[]
  additional_info?: Record<string, unknown> | string

  // Legacy long key format (for backwards compatibility)
  Ticker?: string
  LogoURL?: string
  IssuerName?: string
  Description?: string
  Website?: string
  AssetClass?: string
  Social?: {
    [key: string]: string
  }
  [key: string]: unknown
}

/**
 * Values returned by 'formatMPTIssuance' from /src/rippled/lib/utils.js
 */
export interface FormattedMPTIssuance {
  issuer: string
  sequence: number
  assetScale?: number
  maxAmt?: string
  outstandingAmt?: string
  flags?: string[]
  transferFee?: number
  parsedMetadata?: Record<string, unknown>
  isMetadataCompliant: boolean
}

export interface ErrorMessage {
  title: string
  hints: string[]
}

export type ErrorMessages = {
  default: ErrorMessage
  [code: number]: ErrorMessage
}
