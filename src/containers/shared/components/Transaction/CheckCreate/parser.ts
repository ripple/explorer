import type { CheckCreate, TransactionMetadata } from 'xrpl'
import { findNode } from '../../../transactionUtils'

export const parser = (tx: CheckCreate, meta: TransactionMetadata) => ({
  ...tx,
  checkID: findNode(meta, 'CreatedNode', 'Check')?.LedgerIndex,
})
