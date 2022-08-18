import formatAmount from '../../../../../rippled/lib/txSummary/formatAmount'

export function parser(tx: any, meta: any) {
  const affectedNodes = meta.AffectedNodes
  const modifiedAccountRoots = affectedNodes.filter(
    (node: any) =>
      node.ModifiedNode && node.ModifiedNode.LedgerEntryType === 'AccountRoot',
  )
  const bridgeOwnerNode = modifiedAccountRoots.filter(
    (node: any) => node.ModifiedNode.FinalFields.Account !== tx.Account,
  )[0]
  // TODO: somehow get the bridge owner via ledger_entry
  // AffectedNodes won't contain the bridge owner if the transaction fails
  return {
    lockingDoor: tx.XChainBridge.LockingChainDoor,
    lockingIssue: tx.XChainBridge.LockingChainIssue,
    issuingDoor: tx.XChainBridge.IssuingChainDoor,
    issuingIssue: tx.XChainBridge.IssuingChainIssue,
    amount: formatAmount(tx.Amount),
    xchainClaimId: tx.XChainClaimID,
    bridgeOwner: bridgeOwnerNode?.ModifiedNode?.FinalFields?.Account,
  }
}
