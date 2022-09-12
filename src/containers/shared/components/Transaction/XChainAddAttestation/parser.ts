export function parser(tx: any) {
  // TODO: get bridge owner somehow
  // it's not necessarily in the metadata
  const claimAttestations =
    tx.XChainAttestationBatch.XChainClaimAttestationBatch.map(
      (attestation: any) => ({
        send: attestation.XChainClaimAttestationBatchElement.Amount,
        account: attestation.XChainClaimAttestationBatchElement.Account,
        destination: attestation.XChainClaimAttestationBatchElement.Destination,
        claimId: attestation.XChainClaimAttestationBatchElement.XChainClaimID,
        signature: attestation.XChainClaimAttestationBatchElement.Signature,
      }),
    )
  return {
    lockingDoor: tx.XChainAttestationBatch.XChainBridge.LockingChainDoor,
    lockingIssue: tx.XChainAttestationBatch.XChainBridge.LockingChainIssue,
    issuingDoor: tx.XChainAttestationBatch.XChainBridge.IssuingChainDoor,
    issuingIssue: tx.XChainAttestationBatch.XChainBridge.IssuingChainIssue,
    claimAttestations,
  }
}
