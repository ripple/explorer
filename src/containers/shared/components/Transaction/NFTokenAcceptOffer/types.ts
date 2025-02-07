import { ExplorerAmount } from '../../../types'

export interface NFTokenAcceptOfferInstructions {
  acceptedOfferIDs: string[]
  amount?: ExplorerAmount
  tokenID?: string
  seller?: string
  buyer?: string
}
