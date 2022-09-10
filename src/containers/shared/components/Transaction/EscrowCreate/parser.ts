import { unix } from 'moment'

const EPOCH_OFFSET = 946684800
const convertRippleDate = (date: any) =>
  unix(date + EPOCH_OFFSET)
    .utc()
    .format()

const formatAmount = (d: any) =>
  d.value
    ? {
        currency: d.currency,
        issuer: d.issuer,
        amount: Number(d.value),
      }
    : {
        currency: 'XRP',
        amount: d / 1000000,
      }
export function parser(tx: any) {
  return {
    amount: formatAmount(tx.Amount),
    destination: tx.Destination !== tx.Account ? tx.Destination : undefined,
    condition: tx.Condition,
    cancelAfter: tx.CancelAfter ? convertRippleDate(tx.CancelAfter) : undefined,
    finishAfter: tx.FinishAfter ? convertRippleDate(tx.FinishAfter) : undefined,
  }
}
