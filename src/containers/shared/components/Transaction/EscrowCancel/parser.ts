import type { EscrowCancel, TransactionMetadata } from 'xrpl'
import { formatAmount } from '../../../../../rippled/lib/txSummary/formatAmount'
import { findNode } from '../../../transactionUtils'

const findNodeFinalFields = (meta: TransactionMetadata) => {
  const node = findNode(meta, 'DeletedNode', 'Escrow')
  return node ? node.FinalFields : {}
}

export function parser(tx: EscrowCancel, meta: TransactionMetadata) {
  const escrow = findNodeFinalFields(meta)

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
