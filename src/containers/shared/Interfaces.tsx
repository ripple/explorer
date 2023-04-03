/**
 * Values returned by 'formatAccountInfo' from /src/rippled/lib/utils.js
 */
export interface AccountFormattedInfo {
  sequence?: number
  ticketCount?: number
  ownerCount?: number
  reserve?: number
  tick?: number
  rate?: number
  domain?: string
  emailHash?: string
  flags?: string[]
  balance?: string
  gravatar?: any
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

export interface ErrorMessage {
  title: string
  hints: string[]
}
