import type { CheckCancel, TransactionMetadata } from 'xrpl'
import { findNode } from '../../../transactionUtils'

// Cashing and canceling both delete the Check. Checks are never modified after
// creation, so the deleted node's PreviousTxnID is the CheckCreate that made it.
export const findCheckCreateTx = (
  meta: TransactionMetadata,
): string | undefined =>
  findNode(meta, 'DeletedNode', 'Check')?.FinalFields.PreviousTxnID

export const parser = (tx: CheckCancel, meta: TransactionMetadata) => ({
  ...tx,
  checkTx: findCheckCreateTx(meta),
})
