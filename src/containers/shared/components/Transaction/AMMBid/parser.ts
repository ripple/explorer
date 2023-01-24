import { getAMMAccountID, getAuthAccounts } from '../../../metaParser'

function getMinBid(tx: any) {
  return tx.BidMin
    ? { currency: 'LP', issuer: tx.BidMin.issuer, amount: tx.BidMin.value }
    : undefined
}

function getMaxBid(tx: any) {
  return tx.BidMax
    ? { currency: 'LP', issuer: tx.BidMax.issuer, amount: tx.BidMax.value }
    : undefined
}

export function parser(tx: any, meta: any) {
  const ammAccountID = getAMMAccountID(meta)
  const bidMin = getMinBid(tx)
  const bidMax = getMaxBid(tx)
  const authAccounts = getAuthAccounts(tx)

  return {
    ammAccountID,
    bidMin,
    authAccounts,
    bidMax,
  }
}
