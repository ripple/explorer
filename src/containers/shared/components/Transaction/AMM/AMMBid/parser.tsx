import {
  getAMMAccountID,
  getAuthAccounts,
  getMinBid,
  getMaxBid,
} from '../../../../metaParser'

export function parser(tx: any, meta: any) {
  const accountID = getAMMAccountID(meta)
  const bidMin = getMinBid(tx)
  const bidMax = getMaxBid(tx)
  const authAccounts = getAuthAccounts(tx)

  return {
    accountID,
    bidMin,
    authAccounts,
    bidMax,
  }
}
