import formatAmount from '../../../../../rippled/lib/txSummary/formatAmount'
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
        send: formatAmount(
          attestation.XChainClaimAttestationBatchElement.Amount,
        ),
        account: attestation.XChainClaimAttestationBatchElement.Account,
        destination: attestation.XChainClaimAttestationBatchElement.Destination,
        claimId: attestation.XChainClaimAttestationBatchElement.XChainClaimID,
      }),
    )

  const accountCreateAttestations =
    tx.XChainAttestationBatch.XChainCreateAccountAttestationBatch.map(
      (attestation) => ({
        send: formatAmount(
          attestation.XChainCreateAccountAttestationBatchElement.Amount,
        ),
        account: attestation.XChainCreateAccountAttestationBatchElement.Account,
        destination:
          attestation.XChainCreateAccountAttestationBatchElement.Destination,
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
