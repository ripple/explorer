import { Amount, ExplorerAmount, IssuedCurrency } from '../../../types'

export interface XChainBridge {
  LockingChainDoor: string
  LockingChainIssue: 'XRP' | IssuedCurrency
  IssuingChainDoor: string
  IssuingChainIssue: 'XRP' | IssuedCurrency
}

export interface XChainAddAttestationBatch {
  TransactionType: 'XChainAddAttestationBatch'
  XChainAttestationBatch: {
    XChainBridge: XChainBridge
    XChainClaimAttestationBatch: Array<{
      XChainClaimAttestationBatchElement: {
        Account: string
        Amount: Amount
        AttestationRewardAccount: string
        Destination: string
        PublicKey: string
        Signature: string
        WasLockingChainSend: 0 | 1
        XChainClaimID: string
      }
    }>
    XChainCreateAccountAttestationBatch: Array<{
      XChainCreateAccountAttestationBatchElement: {
        Account: string
        Amount: Amount
        AttestationRewardAccount: string
        Destination: string
        PublicKey: string
        Signature: string
        WasLockingChainSend: 0 | 1
        XChainAccountCreateCount: string
      }
    }>
  }
}

export interface ClaimAttestationInstructions {
  send: ExplorerAmount
  account: string
  destination: string
  claimId: string
}

export interface AccountCreateAttestationInstructions {
  send: ExplorerAmount
  account: string
  destination: string
}

export interface XChainAddAttestationBatchInstructions {
  lockingDoor: string
  lockingIssue: 'XRP' | IssuedCurrency
  issuingDoor: string
  issuingIssue: 'XRP' | IssuedCurrency
  claimAttestations: ClaimAttestationInstructions[]
  accountCreateAttestations: AccountCreateAttestationInstructions[]
}
