import { TransactionCommonFields } from '../types'

export interface ConfidentialMPTMergeInbox extends TransactionCommonFields {
  MPTokenIssuanceID: string
}
