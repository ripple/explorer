import formatAmount from '../../../../../rippled/lib/txSummary/formatAmount'

export function parser(tx: any) {
  return {
    lockingDoor: tx.XChainBridge.LockingChainDoor,
    lockingIssue: tx.XChainBridge.LockingChainIssue,
    issuingDoor: tx.XChainBridge.IssuingChainDoor,
    issuingIssue: tx.XChainBridge.IssuingChainIssue,
    amount: formatAmount(tx.Amount),
    xchainClaimId: tx.XChainClaimID,
  }
}
