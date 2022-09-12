import { NFTokenCreateOfferInstructions } from './types'
import { TransactionParser } from '../types'

const formatAmount = require('../../../../../rippled/lib/txSummary/formatAmount')

export const parser: TransactionParser<NFTokenCreateOfferInstructions> = (
  tx,
  meta,
) => {
  const account = tx.Account
  const amount = formatAmount(tx.Amount)
  const tokenID = tx.NFTokenID
  const isSellOffer = (tx.Flags & 1) !== 0
  const owner = tx.Owner
  const offerID = meta.AffectedNodes.find(
    (node) => node?.CreatedNode?.LedgerEntryType === 'NFTokenOffer',
  )?.CreatedNode?.LedgerIndex

  return {
    account,
    amount,
    tokenID,
    isSellOffer,
    owner,
    offerID,
  }
}
