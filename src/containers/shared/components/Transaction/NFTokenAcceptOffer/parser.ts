import { NFTokenAcceptOffer, NFTokenAcceptOfferInstructions } from './types'
import { TransactionParser } from '../types'
import formatAmount from '../../../../../rippled/lib/txSummary/formatAmount'

export const parser: TransactionParser<
  NFTokenAcceptOffer,
  NFTokenAcceptOfferInstructions
> = (tx, meta) => {
  let acceptedOfferNode
  const acceptedOfferNodes = meta.AffectedNodes.filter(
    (node: any) => node.DeletedNode?.LedgerEntryType === 'NFTokenOffer',
  )

  if (acceptedOfferNodes.length === 1) {
    acceptedOfferNode = acceptedOfferNodes[0].DeletedNode?.FinalFields
  } else {
    acceptedOfferNode = acceptedOfferNodes.find(
      (node: any) => !node.DeletedNode?.FinalFields?.Destination,
    )?.DeletedNode?.FinalFields
  }

  const acceptedOfferIDs = []
  if (tx.NFTokenBuyOffer) {
    acceptedOfferIDs.push(tx.NFTokenBuyOffer)
  }
  if (tx.NFTokenSellOffer) {
    acceptedOfferIDs.push(tx.NFTokenSellOffer)
  }

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
