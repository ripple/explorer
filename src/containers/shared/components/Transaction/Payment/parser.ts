import formatAmount from '../../../../../rippled/lib/txSummary/formatAmount'
import formatFailedPartialAmount from '../../../../../rippled/lib/txSummary/formatFailedPartialAmount'

const isPartialPayment = (flags: any) => 0x00020000 & flags

export const parser = (tx: any, meta: any) => {
  const max = tx.SendMax ? formatAmount(tx.SendMax) : undefined
  const partial = !!isPartialPayment(tx.Flags)
  const failedPartial = partial && meta.TransactionResult !== 'tesSUCCESS'
  const amount = failedPartial
    ? formatFailedPartialAmount(tx.Amount)
    : formatAmount(partial ? meta.delivered_amount : tx.Amount)
  const dt = tx.DestinationTag !== undefined ? `:${tx.DestinationTag}` : ''

  if (tx.Account === tx.Destination) {
    return {
      amount,
      convert: max,
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
