import { unix } from 'moment'
import formatAmount from '../../../../../rippled/lib/txSummary/formatAmount'

const EPOCH_OFFSET = 946684800
const convertRippleDate = (date: any) =>
  unix(date + EPOCH_OFFSET)
    .utc()
    .format()
export function parser(tx: any) {
  return {
    amount: formatAmount(tx.Amount),
    destination: tx.Destination !== tx.Account ? tx.Destination : undefined,
    condition: tx.Condition,
    cancelAfter: tx.CancelAfter ? convertRippleDate(tx.CancelAfter) : undefined,
    finishAfter: tx.FinishAfter ? convertRippleDate(tx.FinishAfter) : undefined,
  }
}
