const utils = require('../utils')

module.exports = (tx, meta) => {
  const affectedNodes = meta.AffectedNodes.filter(
    (node) =>
      node.CreatedNode?.LedgerEntryType === 'NFTokenPage' ||
      node.ModifiedNode?.LedgerEntryType === 'NFTokenPage',
  )

  const previousTokenIDSet = new Set(
    affectedNodes
      .flatMap((node) =>
        node.ModifiedNode?.PreviousFields?.NFTokens?.map(
          (token) => token.NFToken.NFTokenID,
        ),
      )
      .filter((id) => id),
  )

  const finalTokenIDs = affectedNodes
    .flatMap((node) =>
      (
        node.ModifiedNode?.FinalFields ?? node.CreatedNode?.NewFields
      )?.NFTokens?.map((token) => token.NFToken.NFTokenID),
    )
    .filter((id) => id)

  const tokenID = finalTokenIDs.find((tid) => !previousTokenIDSet.has(tid))

  return {
    tokenID,
    tokenTaxon: tx.NFTokenTaxon,
    uri: utils.convertHexToString(tx.URI),
  }
}
