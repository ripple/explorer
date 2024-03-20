import { TransactionCommonFields } from '../types'

export interface MPTokenIssuanceCreate extends TransactionCommonFields {
  AssetScale?: number
  MaximumAmount?: string
  TransferFee?: number
  MPTokenMetadata?: string
}

export interface MPTokenIssuanceCreateInstructions {
  issuanceID?: string
  metadata?: string
  transferFee?: number
  assetScale?: number
  maxAmount?: string
}
