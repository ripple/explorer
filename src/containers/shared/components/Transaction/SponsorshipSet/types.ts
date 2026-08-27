import { TransactionCommonFields } from '../types'

export interface SponsorshipSet extends TransactionCommonFields {
  CounterpartySponsor?: string
  Sponsee?: string
  FeeAmountDelta?: string
  MaxFee?: string
  RemainingOwnerCountDelta?: number
}
