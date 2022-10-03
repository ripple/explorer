import { TransactionCommonFields } from '../types'
import { Amount } from '../XChainAddAttestation/types'

export interface NFTokenCreateOffer extends TransactionCommonFields {
  Owner?: string
  NFTokenID: string
  Amount: Amount
  Expiration?: number
  Destination?: string
}

export interface NFTokenCreateOfferInstructions {
  account: string
  amount: { currency: string; amount: number; issuer?: string }
  tokenID: string
  isSellOffer: boolean
  owner?: string
  offerID: string
}
