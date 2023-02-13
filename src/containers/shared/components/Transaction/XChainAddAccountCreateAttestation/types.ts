import { Amount, ExplorerAmount, IssuedCurrency } from '../../../types'

export interface XChainBridge {
  LockingChainDoor: string
  LockingChainIssue: 'XRP' | IssuedCurrency
  IssuingChainDoor: string
  IssuingChainIssue: 'XRP' | IssuedCurrency
}

export interface XChainAddAccountCreateAttestation {
  TransactionType: 'XChainAddAccountCreateAttestation'
  Account: string
  Amount: Amount
  AttestationRewardAccount: string
  Destination: string
  OtherChainSource: string
  PublicKey: string
  Signature: string
  SignatureReward: Amount
  WasLockingChainSend: 0 | 1
  XChainAccountCreateCount: string
  XChainBridge: XChainBridge
}

export interface XChainAddAccountCreateAttestationInstructions {
  lockingDoor: string
  lockingIssue: 'XRP' | IssuedCurrency
  issuingDoor: string
  issuingIssue: 'XRP' | IssuedCurrency
  amount: ExplorerAmount
  otherChainSource: string
  destination: string
}
