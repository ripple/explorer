import { formatAmount } from '../../../../../rippled/lib/txSummary/formatAmount'

export function parser(tx: any, meta: any) {
  const affectedNodes = meta.AffectedNodes
  const modifiedAccountRoots = affectedNodes.filter(
    (node: any) =>
      node.ModifiedNode && node.ModifiedNode.LedgerEntryType === 'AccountRoot',
  )
  const doorNode = modifiedAccountRoots.filter(
    (node: any) =>
      node.ModifiedNode.FinalFields.Balance <
        node.ModifiedNode.PreviousFields.Balance &&
      node.ModifiedNode.FinalFields.Account !== tx.Account,
  )[0]
  return {
    lockingDoor: tx.XChainBridge.LockingChainDoor,
    lockingIssue: tx.XChainBridge.LockingChainIssue,
    issuingDoor: tx.XChainBridge.IssuingChainDoor,
    issuingIssue: tx.XChainBridge.IssuingChainIssue,
    bridgeOwner: doorNode.ModifiedNode.FinalFields.Account,
    claimId: tx.XChainClaimID,
    destination: tx.Destination,
    amount: formatAmount(tx.Amount),
  }
}
