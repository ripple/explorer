import { findAssetAmount, getAMMAccountID } from '../../../metaParser'
import { formatAmount } from '../../../../../rippled/lib/txSummary/formatAmount'

export function parser(tx: any, meta: any) {
  const tradingFee = tx.TradingFee
  const ammAccountID = getAMMAccountID(meta)
  const amount = formatAmount(tx.Amount)
  const amount2 = formatAmount(tx.Amount2)
  if (amount2) amount2.amount = findAssetAmount(meta, amount2)
  if (amount) amount.amount = findAssetAmount(meta, amount)

  return {
    tradingFee,
    ammAccountID,
    amount,
    amount2,
  }
}
