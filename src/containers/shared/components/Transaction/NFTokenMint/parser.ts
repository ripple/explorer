import { NFTokenMint, NFTokenMintInstructions } from './types'
import { TransactionParser } from '../types'

const utils = require('../../../../../rippled/lib/utils')

export const parser: TransactionParser<NFTokenMint, NFTokenMintInstructions> = (
  tx,
  meta,
) => {
  const affectedNodes = meta.AffectedNodes.filter(
    (node: any) =>
      node.CreatedNode?.LedgerEntryType === 'NFTokenPage' ||
      node.ModifiedNode?.LedgerEntryType === 'NFTokenPage',
  )

  const previousTokenIDSet = new Set(
    affectedNodes
      .flatMap((node: any) =>
        node.ModifiedNode?.PreviousFields?.NFTokens?.map(
          (token: any) => token.NFToken.NFTokenID,
        ),
      )
      .filter((id: any) => id),
  )

  const finalTokenIDs = affectedNodes
    .flatMap((node: any) =>
      (
        node.ModifiedNode?.FinalFields ?? node.CreatedNode?.NewFields
      )?.NFTokens?.map((token: any) => token.NFToken.NFTokenID),
    )
    .filter((id: any) => id)

  const tokenID = finalTokenIDs.find((id: any) => !previousTokenIDSet.has(id))

  return {
    tokenID,
    tokenTaxon: tx.NFTokenTaxon,
    uri: utils.convertHexToString(tx.URI),
  }
}
