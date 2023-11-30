export interface NFTokenCancelOfferInstructions {
  cancelledOffers: {
    amount: { currency: string; amount: number; issuer: string }
    offerID: string
    tokenID: string
    offerer: string
  }[]
}
