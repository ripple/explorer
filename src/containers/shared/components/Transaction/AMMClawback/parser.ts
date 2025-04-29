import type { AMMClawback } from 'xrpl'
import { findAssetAmount } from '../../../metaParser'

export function parser(tx: AMMClawback, meta: any) {
  const account = tx.Account
  const holder = tx.Holder
  const amount = findAssetAmount(meta, tx.Asset, tx)
  if (tx.Flags) {
    // @ts-expect-error - MPT is not being supported for AMM transactions until https://github.com/XRPLF/rippled/pull/5285 is merged
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
