import { NFTokenCancelOffer } from 'xrpl'
import { NFTokenCancelOfferInstructions } from './types'
import { TransactionParser } from '../types'
import { formatAmount } from '../../../../../rippled/lib/txSummary/formatAmount'

export const parser: TransactionParser<
  NFTokenCancelOffer,
  NFTokenCancelOfferInstructions
> = (_, meta) => {
  const cancelledOffers = meta.AffectedNodes.filter(
    (node: any) => node.DeletedNode?.LedgerEntryType === 'NFTokenOffer',
  ).map((node: any) => ({
    offerID: node.DeletedNode.LedgerIndex,
    amount: formatAmount(node.DeletedNode.FinalFields.Amount),
    tokenID: node.DeletedNode.FinalFields.NFTokenID,
    offerer: node.DeletedNode.FinalFields.Owner,
  }))

  return {
    cancelledOffers,
  }
}
