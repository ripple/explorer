import { TransactionCommonFields } from '../types'

export interface SponsorshipTransfer extends TransactionCommonFields {
  ObjectID?: string
  Sponsor?: string
  SponsorFlags?: number
  Sponsee?: string
}
