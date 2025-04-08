import type { AMMClawback } from 'xrpl'
import { findAssetAmount } from '../../../metaParser'

export function parser(tx: AMMClawback, meta: any) {
  const account = tx.Account
  const holder = tx.Holder
  const amount = findAssetAmount(meta, tx.Asset, tx)
  if (tx.Flags) {
    const amount2 = findAssetAmount(meta, tx.Asset2, tx)
    return {
      amount,
      account,
      amount2,
      holder,
    }
  }
  return {
    amount,
    account,
    holder,
  }
}
