import { findAssetAmount, getAMMAccountID } from '../../../../metaParser'

export function parser(tx: any, meta: any) {
  const tradingFee = tx.TradingFee
  const accountID = getAMMAccountID(meta)
  const amount = tx.Asset
  const amount2 = tx.Asset2
  amount2.amount = findAssetAmount(meta, amount2)
  amount.amount = findAssetAmount(meta, amount)

  return {
    tradingFee,
    accountID,
    amount,
    amount2,
  }
}
