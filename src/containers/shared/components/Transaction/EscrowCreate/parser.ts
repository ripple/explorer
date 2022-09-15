import formatAmount from '../../../../../rippled/lib/txSummary/formatAmount'
import { convertRippleDate } from '../../../../../rippled/lib/utils'
export function parser(tx: any) {
  return {
    amount: formatAmount(tx.Amount),
    destination: tx.Destination !== tx.Account ? tx.Destination : undefined,
    condition: tx.Condition,
    cancelAfter: tx.CancelAfter ? convertRippleDate(tx.CancelAfter) : undefined,
    finishAfter: tx.FinishAfter ? convertRippleDate(tx.FinishAfter) : undefined,
  }
}
