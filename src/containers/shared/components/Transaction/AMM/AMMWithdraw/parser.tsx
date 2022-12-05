import {
  findAssetAmount,
  getAMMAccountID,
  getLPTokenAmount,
} from '../../../../MetaParser'

export function parser(tx: any, meta: any) {
  const amount = tx.Asset
  const amount2 = tx.Asset2
  const accountID = getAMMAccountID(meta)
  const lpTokens = getLPTokenAmount(meta)
  amount2.amount = findAssetAmount(meta, amount2)
  amount.amount = findAssetAmount(meta, amount)

  return {
    amount,
    amount2,
    accountID,
    lpTokens,
  }
}
