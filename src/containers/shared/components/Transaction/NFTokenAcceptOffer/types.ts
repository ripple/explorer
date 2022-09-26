import { TransactionCommonFields } from '../types'
import { Amount } from '../XChainAddAttestation/types'

export interface NFTokenAcceptOffer extends TransactionCommonFields {
  NFTokenSellOffer?: string
  NFTokenBuyOffer?: string
  NFTokenBrokerFee?: Amount
}

export interface NFTokenAcceptOfferInstructions {
  acceptedOfferIDs: string[]
  amount?: { currency: string; amount: number; issuer?: string }
  tokenID?: string
  seller?: string
  buyer?: string
}
