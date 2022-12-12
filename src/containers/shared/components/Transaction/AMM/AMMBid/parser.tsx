import {
  getAMMAccountID,
  getAuthAccounts,
  getMinBid,
} from '../../../../MetaParser'

export function parser(tx: any, meta: any) {
  const accountID = getAMMAccountID(meta)
  const bidMin = getMinBid(tx)
  const authAccounts = getAuthAccounts(tx)

  return {
    accountID,
    bidMin,
    authAccounts,
  }
}
