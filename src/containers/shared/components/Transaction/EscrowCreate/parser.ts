import type { EscrowCreate } from 'xrpl'
import { formatAmount } from '../../../../../rippled/lib/txSummary/formatAmount'
import { convertRippleDate } from '../../../../../rippled/lib/convertRippleDate'

export function parser(tx: EscrowCreate) {
  return {
    amount: formatAmount(tx.Amount),
    destination: tx.Destination !== tx.Account ? tx.Destination : undefined,
    condition: tx.Condition,
    cancelAfter: tx.CancelAfter ? convertRippleDate(tx.CancelAfter) : undefined,
    finishAfter: tx.FinishAfter ? convertRippleDate(tx.FinishAfter) : undefined,
  }
}
