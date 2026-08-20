import { TransactionCommonFields } from '../types'

export interface SponsorshipSet extends TransactionCommonFields {
  CounterpartySponsor?: string
  Sponsee?: string
  FeeAmount?: string
  MaxFee?: string
  ReserveCount?: number
}
