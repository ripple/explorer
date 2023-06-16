import { formatAmount } from '../../../../../rippled/lib/txSummary/formatAmount'
import { findNode } from '../../../transactionUtils'

const findNodeFinalFields = (meta: any) => {
  const node = findNode(meta, 'DeletedNode', 'Escrow')
  return node ? node.FinalFields : {}
}

export function parser(tx: any, meta: any) {
  const escrow = findNodeFinalFields(meta)
  return {
    sequence: tx.OfferSequence,
    owner: tx.Owner,
    previousTx: escrow.PreviousTxnID,
    amount: escrow.Amount ? formatAmount(escrow.Amount) : undefined,
    destination:
      escrow.Destination && escrow.Destination !== escrow.Account
        ? escrow.Destination
        : undefined,
    condition: escrow.Condition,
    fulfillment: tx.Fulfillment,
  }
}
