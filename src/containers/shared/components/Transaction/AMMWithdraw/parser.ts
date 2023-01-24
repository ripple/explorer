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
  const amount = findAssetAmount(meta, tx.Asset, tx)
  const amount2 = findAssetAmount(meta, tx.Asset2, tx)

  return {
    amount,
    amount2,
    ammAccountID,
    lpTokens,
    ePrice,
  }
}
