import { TransactionParser } from '../types'
import { XChainAddAttestation, XChainAddAttestationInstructions } from './types'

export const parser: TransactionParser<
  XChainAddAttestation,
  XChainAddAttestationInstructions
> = (tx) => {
  // TODO: get bridge owner somehow
  // it's not necessarily in the metadata
  const claimAttestations =
    tx.XChainAttestationBatch.XChainClaimAttestationBatch.map(
      (attestation) => ({
        send: attestation.XChainClaimAttestationBatchElement.Amount,
        account: attestation.XChainClaimAttestationBatchElement.Account,
        destination: attestation.XChainClaimAttestationBatchElement.Destination,
        claimId: attestation.XChainClaimAttestationBatchElement.XChainClaimID,
        signature: attestation.XChainClaimAttestationBatchElement.Signature,
      }),
    )

  const accountCreateAttestations =
    tx.XChainAttestationBatch.XChainCreateAccountAttestationBatch.map(
      (attestation) => ({
        send: attestation.XChainCreateAccountAttestationBatchElement.Amount,
        account: attestation.XChainCreateAccountAttestationBatchElement.Account,
        destination:
          attestation.XChainCreateAccountAttestationBatchElement.Destination,
        signature:
          attestation.XChainCreateAccountAttestationBatchElement.Signature,
      }),
    )
  return {
    lockingDoor: tx.XChainAttestationBatch.XChainBridge.LockingChainDoor,
    lockingIssue: tx.XChainAttestationBatch.XChainBridge.LockingChainIssue,
    issuingDoor: tx.XChainAttestationBatch.XChainBridge.IssuingChainDoor,
    issuingIssue: tx.XChainAttestationBatch.XChainBridge.IssuingChainIssue,
    claimAttestations,
    accountCreateAttestations,
  }
}
