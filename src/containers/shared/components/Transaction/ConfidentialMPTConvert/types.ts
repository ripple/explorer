import { TransactionCommonFields } from '../types'

export interface ConfidentialMPTConvert extends TransactionCommonFields {
  MPTokenIssuanceID: string
  MPTAmount: number
  HolderEncryptionKey?: string
  HolderEncryptedAmount: string
  IssuerEncryptedAmount: string
  AuditorEncryptedAmount?: string
  BlindingFactor: string
  ZKProof?: string
}
