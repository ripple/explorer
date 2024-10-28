import { TransactionCommonFields } from '../types'

export interface MPTokenIssuanceSet extends TransactionCommonFields {
  MPTokenIssuanceID: string
  Holder?: string
}
