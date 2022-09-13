import { NFTokenCancelOfferInstructions } from './types'
import { TransactionParser } from '../types'
import formatAmount from '../../../../../rippled/lib/txSummary/formatAmount'

export const parser: TransactionParser<NFTokenCancelOfferInstructions> = (
  tx,
  meta,
) => {
  const cancelledOffers = meta.AffectedNodes.filter(
    (node) => node.DeletedNode?.LedgerEntryType === 'NFTokenOffer',
  ).map((node) => ({
    offerID: node.DeletedNode.LedgerIndex,
    amount: formatAmount(node.DeletedNode.FinalFields.Amount),
    tokenID: node.DeletedNode.FinalFields.NFTokenID,
    offerer: node.DeletedNode.FinalFields.Owner,
  }))

  return {
    cancelledOffers,
  }
}
