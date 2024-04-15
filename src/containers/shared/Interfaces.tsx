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
 * Values returned by 'formatMPTIssuanceInfo' from /src/rippled/lib/utils.js
 */
export interface MPTIssuanceFormattedInfo {
  issuer: string
  sequence: number
  assetScale?: number
  maxAmt: string
  outstandingAmt?: string
  flags?: string[]
  transferFee?: number
  metadata?: string
}

export interface ErrorMessage {
  title: string
  hints: string[]
}

export type ErrorMessages = {
  default: ErrorMessage
  [code: number]: ErrorMessage
}
