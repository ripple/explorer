export interface AccountFormattedInfoProps {
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
}

export interface NFTInfoProps {
  NFTId: string
  ledgerIndex?: number
  owner?: string
  isBurned?: boolean
  flags?: string[]
  transferFee?: number
  issuer?: string
  NFTTaxon?: number
  NFTSequence?: number
  uri?: string
  validated?: boolean
  status?: string
  warnings?: string[]
}

export interface ErrorMessage {
  title: string
  hints: string[]
}
