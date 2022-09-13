import { NFTokenAcceptOfferInstructions } from './types'
import { TransactionParser } from '../types'
import formatAmount from '../../../../../rippled/lib/txSummary/formatAmount'

export const parser: TransactionParser<NFTokenAcceptOfferInstructions> = (
  tx,
  meta,
) => {
  const acceptedOfferNode = meta.AffectedNodes.find(
    (node) => node.DeletedNode?.LedgerEntryType === 'NFTokenOffer',
  )?.DeletedNode?.FinalFields

  const acceptedOfferIDs = [tx.NFTokenBuyOffer, tx.NFTokenSellOffer].filter(
    (offer) => offer,
  )

  if (!acceptedOfferNode) {
    return {
      acceptedOfferIDs,
    }
  }

  const amount = formatAmount(acceptedOfferNode.Amount)
  const tokenID = acceptedOfferNode.NFTokenID
  const offerer = acceptedOfferNode.Owner
  const accepter = tx.Account
  const isSellOffer = (acceptedOfferNode.Flags & 1) !== 0
  const seller = isSellOffer ? offerer : accepter
  const buyer = isSellOffer ? accepter : offerer

  return {
    amount,
    tokenID,
    seller,
    buyer,
    acceptedOfferIDs,
  }
}
