import { TransactionCommonFields } from '../types'

export interface ConfidentialMPTSend extends TransactionCommonFields {
  MPTokenIssuanceID: string
  Destination: string
  SenderEncryptedAmount: string
  DestinationEncryptedAmount: string
  IssuerEncryptedAmount: string
  AuditorEncryptedAmount?: string
  ZKProof: string
  BalanceCommitment: string
  AmountCommitment: string
  CredentialIDs?: string[]
}
