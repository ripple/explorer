import type { CheckCash, TransactionMetadata } from 'xrpl'
import { findCheckCreateTx } from '../CheckCancel/parser'

export const parser = (tx: CheckCash, meta: TransactionMetadata) => ({
  ...tx,
  checkTx: findCheckCreateTx(meta),
  // With DeliverMin the cashed amount is only known from the metadata, the
  // same way partial payments are handled.
  delivered:
    tx.DeliverMin && meta.delivered_amount !== 'unavailable'
      ? meta.delivered_amount
      : undefined,
})
