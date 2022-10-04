import { TransactionCommonFields } from '../types'

export interface OfferCancel extends TransactionCommonFields {
  OfferSequence: number
}

export interface OfferCancelInstructions {
  cancel: number
}
