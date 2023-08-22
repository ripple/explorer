export interface NFTokenCreateOfferInstructions {
  account: string
  amount: { currency: string; amount: number; issuer?: string }
  tokenID: string
  isSellOffer: boolean
  owner?: string
  offerID: string
  destination?: string
}
