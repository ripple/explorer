import { findAssetAmount, getAMMAccountID } from '../../../metaParser'

export function parser(tx: any, meta: any) {
  const tradingFee = tx.TradingFee
  const ammAccountID = getAMMAccountID(meta)
  const amount = findAssetAmount(meta, tx.Asset, tx)
  const amount2 = findAssetAmount(meta, tx.Asset2, tx)

  return {
    tradingFee,
    ammAccountID,
    amount,
    amount2,
  }
}
