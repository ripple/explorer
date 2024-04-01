//import type { Payment } from 'xrpl'
import { formatAmount } from '../../../../../rippled/lib/txSummary/formatAmount'
import { PaymentInstructions } from './types'
import { Amount, ExplorerAmount } from '../../../types'

const formatFailedPartialAmount = (d: Amount): ExplorerAmount => ({
  ...formatAmount(d),
  amount: 0,
})

export const isPartialPayment = (flags: any) => 0x00020000 & flags

// TODO: use MPTAmount type from xrpl.js
export const parser = (tx: any, meta: any): PaymentInstructions => {
  const max = tx.SendMax ? formatAmount(tx.SendMax) : undefined
  const partial = !!isPartialPayment(tx.Flags)
  const failedPartial = partial && meta.TransactionResult !== 'tesSUCCESS'
  const amount = failedPartial
    ? formatFailedPartialAmount(tx.Amount)
    : formatAmount(partial ? meta.delivered_amount : tx.Amount)
  const dt = tx.DestinationTag !== undefined ? `:${tx.DestinationTag}` : ''
  const destination = `${tx.Destination}${dt}`

  if (tx.Account === tx.Destination) {
    return {
      amount,
      convert: max,
      destination,
      partial,
    }
  }

  return {
    amount,
    max,
    destination: `${tx.Destination}${dt}`,
    sourceTag: tx.SourceTag,
    partial,
  }
}
