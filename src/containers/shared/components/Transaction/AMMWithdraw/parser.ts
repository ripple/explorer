import {
  findAssetAmount,
  getAMMAccountID,
  getLPTokenAmount,
} from '../../../metaParser'
import { XRP_BASE } from '../../../transactionUtils'
import formatAmount from '../../../../../rippled/lib/txSummary/formatAmount'

export function parser(tx: any, meta: any) {
  const amount = tx.Asset
  const amount2 = tx.Asset2
  const ammAccountID = getAMMAccountID(meta)
  const lpTokens = getLPTokenAmount(meta)
  const ePrice = formatAmount(tx.EPrice)
  const fee = tx.Fee / XRP_BASE
  amount2.amount = findAssetAmount(meta, amount2)
  amount.amount = findAssetAmount(meta, amount)

  return {
    amount,
    amount2,
    ammAccountID,
    lpTokens,
    ePrice,
    fee,
  }
}
