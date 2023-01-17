import {
  findAssetAmount,
  findEffectivePrice,
  getAMMAccountID,
  getLPTokenAmount,
} from '../../../../metaParser'
import { XRP_BASE } from '../../../../transactionUtils'

export function parser(tx: any, meta: any) {
  const amount = tx.Asset
  const amount2 = tx.Asset2
  const accountID = getAMMAccountID(meta)
  const lpTokens = getLPTokenAmount(meta)
  const ePrice = findEffectivePrice(tx)
  const fee = tx.Fee / XRP_BASE
  amount2.amount = findAssetAmount(meta, amount2)
  amount.amount = findAssetAmount(meta, amount)

  return {
    amount,
    amount2,
    accountID,
    lpTokens,
    ePrice,
    fee,
  }
}
