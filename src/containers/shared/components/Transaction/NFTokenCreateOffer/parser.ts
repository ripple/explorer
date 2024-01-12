import type { NFTokenCreateOffer } from 'xrpl'
import { NFTokenCreateOfferInstructions } from './types'
import { TransactionParser } from '../types'
import { formatAmount } from '../../../../../rippled/lib/txSummary/formatAmount'
import { findNode } from '../../../transactionUtils'

export const parser: TransactionParser<
  NFTokenCreateOffer,
  NFTokenCreateOfferInstructions
> = (tx, meta) => {
  const account = tx.Account
  const amount = formatAmount(tx.Amount)
  const tokenID = tx.NFTokenID
  const isSellOffer = ((tx.Flags as number)! & 1) !== 0
  const owner = tx.Owner
  const offerID = findNode(meta, 'CreatedNode', 'NFTokenOffer')?.LedgerIndex
  const destination = tx.Destination

  return {
    account,
    amount,
    tokenID,
    isSellOffer,
    owner,
    offerID,
    destination,
  }
}
