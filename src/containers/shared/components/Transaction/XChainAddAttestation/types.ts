export interface IssuedCurrency {
  currency: string
  issuer: string
}

export interface IssuedCurrencyAmount extends IssuedCurrency {
  value: string
}

export type Amount = IssuedCurrencyAmount | string

export interface XChainBridge {
  LockingChainDoor: string
  LockingChainIssue: 'XRP' | IssuedCurrency
  IssuingChainDoor: string
  IssuingChainIssue: 'XRP' | IssuedCurrency
}

export interface XChainAddAttestation {
  TransactionType: 'XChainAddAttestation'

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

export interface XChainAddAttestationInstructions {
  lockingDoor: string

  lockingIssue: 'XRP' | IssuedCurrency

  issuingDoor: string

  issuingIssue: 'XRP' | IssuedCurrency

  claimAttestations: {
    send: Amount
    account: string
    destination: string
    claimId: string
    signature: string
  }[]

  accountCreateAttestations: {
    send: Amount
    account: string
    destination: string
    signature: string
  }[]
}
