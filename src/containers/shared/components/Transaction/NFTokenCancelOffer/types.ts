import { TransactionCommonFields } from '../types'

export interface NFTokenCancelOffer extends TransactionCommonFields {
  NFTokenOffers: string[]
}

export interface NFTokenCancelOfferInstructions {
  cancelledOffers: {
    amount: { currency: string; amount: number; issuer: string }
    offerID: string
    tokenID: string
    offerer: string
  }[]
}
