import formatAmount from '../../../../../rippled/lib/txSummary/formatAmount'
import { findNode } from '../../../transactionUtils'

export function parser(tx: any) {
  const escrow = findNode(tx, 'DeletedNode', 'Escrow').DeletedNode
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
    fulfillment: tx.Fulfillment,
  }
}
