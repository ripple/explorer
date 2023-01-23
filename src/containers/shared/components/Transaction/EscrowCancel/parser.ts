import { formatAmount } from '../../../../../rippled/lib/txSummary/formatAmount'

const findNode = (meta: any) => {
  const node = meta.AffectedNodes.filter(
    (a: any) => a.DeletedNode && a.DeletedNode.LedgerEntryType === 'Escrow',
  )[0]

  return node ? node.DeletedNode.FinalFields : {}
}

export function parser(tx: any, meta: any) {
  const escrow = findNode(meta)

  return {
    sequence: tx.OfferSequence,
    owner: tx.Owner,
    tx: escrow.PreviousTxnID,
    amount: escrow.Amount ? formatAmount(escrow.Amount) : undefined,
    destination:
      escrow.Destination && escrow.Destination !== escrow.Account
        ? escrow.Destination
        : undefined,
    condition: escrow.Condition,
  }
}
