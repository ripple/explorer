import { TransactionCommonFields } from '../types'

export interface NFTokenMint extends TransactionCommonFields {
  NFTokenTaxon: number
  Issuer?: string
  TransferFee?: number
  URI?: string
}

export interface NFTokenMintInstructions {
  tokenID: string
  tokenTaxon: number
  uri?: string
}
