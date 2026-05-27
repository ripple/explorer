import { TransactionCommonFields } from '../types'

export interface ConfidentialMPTConvertBack extends TransactionCommonFields {
  MPTokenIssuanceID: string
  MPTAmount: string
  HolderEncryptedAmount: string
  IssuerEncryptedAmount: string
  AuditorEncryptedAmount?: string
  BlindingFactor: string
  BalanceCommitment: string
  ZKProof: string
}
