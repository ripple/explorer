import {
  getAMMAccountID,
  findAssetAmount,
  findEffectivePrice,
} from '../../../../metaParser'
import { XRP_BASE } from '../../../../transactionUtils'

export function parser(tx: any, meta: any) {
  const amount = tx.Asset
  const amount2 = tx.Asset2
  const accountID = getAMMAccountID(meta)
  const fee = tx.Fee / XRP_BASE
  const ePrice = findEffectivePrice(tx)
  amount2.amount = findAssetAmount(meta, amount2)
  amount.amount = findAssetAmount(meta, amount)

  return {
    amount,
    amount2,
    accountID,
    fee,
    ePrice,
  }
}
