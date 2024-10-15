import { ExplorerAmount } from '../../../types'

export interface NFTokenCreateOfferInstructions {
  account: string
  amount: ExplorerAmount
  tokenID: string
  isSellOffer: boolean
  owner?: string
  offerID: string
  destination?: string
}
