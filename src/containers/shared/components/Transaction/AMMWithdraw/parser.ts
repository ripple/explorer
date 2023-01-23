import {
  findAssetAmount,
  getAMMAccountID,
  getLPTokenAmount,
} from '../../../metaParser'
import { formatAmount } from '../../../../../rippled/lib/txSummary/formatAmount'

export function parser(tx: any, meta: any) {
  const ammAccountID = getAMMAccountID(meta)
  const lpTokens = getLPTokenAmount(meta)
  const ePrice = formatAmount(tx.EPrice)
  const amount = formatAmount(tx.Amount)
  const amount2 = formatAmount(tx.Amount2)
  if (amount) amount.amount = findAssetAmount(meta, amount)
  if (amount2) amount2.amount = findAssetAmount(meta, amount2)

  return {
    amount,
    amount2,
    ammAccountID,
    lpTokens,
    ePrice,
  }
}
