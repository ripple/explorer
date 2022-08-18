import formatAmount from '../../../../../rippled/lib/txSummary/formatAmount'

export function parser(tx: any, meta: any) {
  const affectedNodes = meta.AffectedNodes
  const bridgeMeta = affectedNodes.filter(
    (node: any) =>
      node.ModifiedNode && node.ModifiedNode.LedgerEntryType === 'Bridge',
  )[0]
  return {
    lockingDoor: tx.XChainBridge.LockingChainDoor,
    lockingIssue: tx.XChainBridge.LockingChainIssue,
    issuingDoor: tx.XChainBridge.IssuingChainDoor,
    issuingIssue: tx.XChainBridge.IssuingChainIssue,
    amount: formatAmount(tx.Amount),
    otherChainDestination: tx.Destination,
    bridgeOwner: bridgeMeta.ModifiedNode.FinalFields.Account,
  }
}
