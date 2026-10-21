import type { CheckCash, TransactionMetadata } from 'xrpl'

export const parser = (tx: CheckCash, meta: TransactionMetadata) => ({
  ...tx,
  // With DeliverMin the cashed amount is only known from the metadata, the
  // same way partial payments are handled.
  delivered:
    tx.DeliverMin && meta.delivered_amount !== 'unavailable'
      ? meta.delivered_amount
      : undefined,
})
