import { TransactionCommonFields } from '../types'

export interface MPTokenAuthorize extends TransactionCommonFields {
  MPTokenIssuanceID: string
  MPTokenHolder?: string
}
