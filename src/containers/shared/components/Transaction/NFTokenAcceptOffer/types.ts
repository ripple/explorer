import { TransactionCommonFields } from '../types'

export interface NFTokenAcceptOffer extends TransactionCommonFields {
  NFTokenSellOffer?: string
  NFTokenBuyOffer?: string
  NFTokenBrokerFee?:
    | string
    | { currency: string; value: string; issuer: string }
}

export interface NFTokenAcceptOfferInstructions {
  acceptedOfferIDs: string[]
  amount?: { currency: string; amount: number; issuer?: string }
  tokenID?: string
  seller?: string
  buyer?: string
}
