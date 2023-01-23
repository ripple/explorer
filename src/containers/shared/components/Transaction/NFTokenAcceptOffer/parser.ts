import { NFTokenAcceptOffer, NFTokenAcceptOfferInstructions } from './types'
import { TransactionParser } from '../types'
import { formatAmount } from '../../../../../rippled/lib/txSummary/formatAmount'

const determineIsSellOffer = (flags: number) => (flags & 1) !== 0

export const parser: TransactionParser<
  NFTokenAcceptOffer,
  NFTokenAcceptOfferInstructions
> = (tx, meta) => {
  const acceptedOfferNodes = meta.AffectedNodes.filter(
    (node: any) => node.DeletedNode?.LedgerEntryType === 'NFTokenOffer',
  )

  const acceptedOfferIDs = []
  if (tx.NFTokenBuyOffer) {
    acceptedOfferIDs.push(tx.NFTokenBuyOffer)
  }
  if (tx.NFTokenSellOffer) {
    acceptedOfferIDs.push(tx.NFTokenSellOffer)
  }

  // If in brokered mode, we must fetch both of the NFTokenOffer nodes
  // in order to fetch the seller and buyer from each
  if (acceptedOfferNodes.length > 1) {
    const buyOfferNode = acceptedOfferNodes.find(
      (node: any) =>
        !determineIsSellOffer(node.DeletedNode?.FinalFields?.Flags),
    )?.DeletedNode?.FinalFields

    const sellOfferNode = acceptedOfferNodes.find((node: any) =>
      determineIsSellOffer(node.DeletedNode?.FinalFields?.Flags),
    )?.DeletedNode?.FinalFields

    return {
      amount: formatAmount(buyOfferNode.Amount),
      tokenID: buyOfferNode.NFTokenID,
      seller: sellOfferNode.Owner,
      buyer: buyOfferNode.Owner,
      acceptedOfferIDs,
    }
  }

  const acceptedOfferNode = acceptedOfferNodes[0]?.DeletedNode?.FinalFields

  if (!acceptedOfferNode) {
    return {
      acceptedOfferIDs,
    }
  }

  const amount = formatAmount(acceptedOfferNode.Amount)
  const tokenID = acceptedOfferNode.NFTokenID
  const offerer = acceptedOfferNode.Owner
  const accepter = tx.Account
  const isSellOffer = determineIsSellOffer(acceptedOfferNode.Flags)
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
