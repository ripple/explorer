import {
  getAMMAccountID,
  findAssetAmount,
  getLPTokenAmount,
} from '../../../metaParser'
import { formatAmount } from '../../../../../rippled/lib/txSummary/formatAmount'

export function parser(tx: any, meta: any) {
  const ammAccountID = getAMMAccountID(meta)
  const ePrice = formatAmount(tx.EPrice)
  const amount = formatAmount(tx.Amount)
  const amount2 = formatAmount(tx.Amount2)
  const lpTokens = getLPTokenAmount(meta)
  if (amount) amount.amount = findAssetAmount(meta, amount)
  if (amount2) amount2.amount = findAssetAmount(meta, amount2)

  return {
    amount,
    amount2,
    ammAccountID,
    ePrice,
    lpTokens,
  }
}
