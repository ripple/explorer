import { TransactionCommonFields } from '../types'

export interface ConfidentialMPTClawback extends TransactionCommonFields {
  MPTokenIssuanceID: string
  Holder: string
  MPTAmount: number
  ZKProof: string
}
