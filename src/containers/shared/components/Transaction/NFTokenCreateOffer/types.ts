import { TransactionCommonFields } from '../types'

export interface NFTokenCreateOffer extends TransactionCommonFields {
  Owner?: string
  NFTokenID: string
  Amount: string | { currency: string; value: string; issuer: string }
  Expiration?: number
  Destination?: string
}

export interface NFTokenCreateOfferInstructions {
  account: string
  amount: { currency: string; amount: number; issuer: string }
  tokenID: string
  isSellOffer: boolean
  owner?: string
  offerID: string
}
