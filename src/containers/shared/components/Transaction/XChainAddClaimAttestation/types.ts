import { Amount, ExplorerAmount, IssuedCurrency } from '../../../types'

export interface XChainBridge {
  LockingChainDoor: string
  LockingChainIssue: 'XRP' | IssuedCurrency
  IssuingChainDoor: string
  IssuingChainIssue: 'XRP' | IssuedCurrency
}

export interface XChainAddClaimAttestation {
  TransactionType: 'XChainAddClaimAttestation'
  Account: string
  Amount: Amount
  AttestationRewardAccount: string
  Destination?: string
  OtherChainSource: string
  PublicKey: string
  Signature: string
  WasLockingChainSend: 0 | 1
  XChainBridge: XChainBridge
  XChainClaimID: string
}

export interface XChainAddClaimAttestationInstructions {
  lockingDoor: string
  lockingIssue: 'XRP' | IssuedCurrency
  issuingDoor: string
  issuingIssue: 'XRP' | IssuedCurrency
  amount: ExplorerAmount
  otherChainSource: string
  destination?: string
  claimId: string
}
