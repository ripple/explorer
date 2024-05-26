import pathParser from 'xrpl-tx-path-parser'
import { CURRENCY_ORDER } from '../../../transactionUtils'
import { formatAmount } from '../../../../../rippled/lib/txSummary/formatAmount'

export function parser(tx: any, meta: any) {
  const gets = formatAmount(tx.TakerGets)
  const base = tx.TakerGets.currency ? tx.TakerGets : { currency: 'XRP' }
  const counter = tx.TakerPays.currency ? tx.TakerPays : { currency: 'XRP' }
  const pays = formatAmount(tx.TakerPays)
  const price = pays.amount / gets.amount
  const invert =
    CURRENCY_ORDER.indexOf(counter.currency) >
    CURRENCY_ORDER.indexOf(base.currency)

  tx.meta = meta
  const parsed = pathParser(tx)
  const deliveredPrice =
    parsed.destinationAmount.value > 0
      ? Math.abs(parsed.destinationAmount.value / parsed.sourceAmount.value)
      : undefined

  return {
    gets,
    pays,
    price: (invert ? 1 / price : price).toPrecision(6),
    deliveredPrice:
      deliveredPrice !== undefined
        ? (invert ? 1 / deliveredPrice : deliveredPrice).toPrecision(6)
        : undefined,
    firstCurrency: invert ? counter : base,
    secondCurrency: invert ? base : counter,
    cancel: tx.OfferSequence,
  }
}
