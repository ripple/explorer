import { TransactionCommonFields } from '../types'
import { IssuedCurrencyAmount, Amount } from '../XChainAddAttestation/types'

export interface NFTokenCreateOffer extends TransactionCommonFields {
  Owner?: string
  NFTokenID: string
  Amount: Amount
  Expiration?: number
  Destination?: string
}

export interface NFTokenCreateOfferInstructions {
  account: string
  amount: IssuedCurrencyAmount
  tokenID: string
  isSellOffer: boolean
  owner?: string
  offerID: string
}
