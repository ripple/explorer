import type { NFTokenMint } from 'xrpl'
import { NFTokenMintInstructions } from './types'
import { TransactionParser } from '../types'

import { convertHexToString } from '../../../../../rippled/lib/utils'

export const parser: TransactionParser<NFTokenMint, NFTokenMintInstructions> = (
  tx,
  meta,
) => {
  // When a mint results in splitting an existing page,
  // it results in a created page and a modified node. Sometimes,
  // the created node needs to be linked to a third page, resulting
  // in modifying that third page's PreviousPageMin or NextPageMin
  // field changing, but no NFTs within that page changing. In this
  // case, there will be no previous NFTs and we need to skip.
  // However, there will always be NFTs listed in the final fields,
  // as rippled outputs all fields in final fields even if they were
  // not changed. Thus why we add the additional condition to check
  // if the PreviousFields contains NFTokens
  const affectedNodes = meta.AffectedNodes.filter(
    (node: any) =>
      node.CreatedNode?.LedgerEntryType === 'NFTokenPage' ||
      (node.ModifiedNode?.LedgerEntryType === 'NFTokenPage' &&
        !!node.ModifiedNode?.PreviousFields.NFTokens),
  )

  const previousTokenIDSet = new Set(
    affectedNodes
      .flatMap(
        (node: any) =>
          node.ModifiedNode?.PreviousFields?.NFTokens?.map(
            (token: any) => token.NFToken.NFTokenID,
          ),
      )
      .filter((id: any) => id),
  )

  const finalTokenIDs = affectedNodes
    .flatMap(
      (node: any) =>
        (
          node.ModifiedNode?.FinalFields ?? node.CreatedNode?.NewFields
        )?.NFTokens?.map((token: any) => token.NFToken.NFTokenID),
    )
    .filter((id: any) => id)

  const tokenID = finalTokenIDs.find((id: any) => !previousTokenIDSet.has(id))

  return {
    tokenID,
    tokenTaxon: tx.NFTokenTaxon,
    uri: convertHexToString(tx.URI),
    transferFee: tx.TransferFee,
    issuer: tx.Issuer,
  }
}
