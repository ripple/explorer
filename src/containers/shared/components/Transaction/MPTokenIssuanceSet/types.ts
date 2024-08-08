import { TransactionCommonFields } from '../types'

export interface MPTokenIssuanceSet extends TransactionCommonFields {
  MPTokenIssuanceID: string
  MPTokenHolder?: string
}
