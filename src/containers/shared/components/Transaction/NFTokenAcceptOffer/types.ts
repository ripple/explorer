export interface NFTokenAcceptOfferInstructions {
  acceptedOfferIDs: string[]
  amount?: { currency: string; amount: number; issuer?: string }
  tokenID?: string
  seller?: string
  buyer?: string
}
