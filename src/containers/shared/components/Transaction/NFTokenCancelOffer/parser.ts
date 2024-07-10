import type { NFTokenCancelOffer } from 'xrpl'
import { NFTokenCancelOfferInstructions } from './types'
import { TransactionParser } from '../types'
import { formatAmount } from '../../../../../rippled/lib/txSummary/formatAmount'

export const parser: TransactionParser<
  NFTokenCancelOffer,
  NFTokenCancelOfferInstructions
> = (_, meta) => {
  // Purposely do not use meta.nftoken_ids[] to keep logic simple
  // since we iterate nodes for other fields
  const cancelledOffers = meta.AffectedNodes.filter(
    (node: any) => node.DeletedNode?.LedgerEntryType === 'NFTokenOffer',
  ).map((node: any) => ({
    offerID: node.offer_id,
    amount: formatAmount(node.DeletedNode.FinalFields.Amount),
    tokenID: node.DeletedNode.FinalFields.NFTokenID,
    offerer: node.DeletedNode.FinalFields.Owner,
  }))

  return {
    cancelledOffers,
  }
}
