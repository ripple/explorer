const utils = require('../utils');

module.exports = (tx, meta) => {
  const affectedNode = meta.AffectedNodes.find(
    node =>
      node?.CreatedNode?.LedgerEntryType === 'NFTokenPage' ||
      node?.ModifiedNode?.LedgerEntryType === 'NFTokenPage'
  );
  const nftNode = affectedNode.CreatedNode ?? affectedNode.ModifiedNode;

  const previousTokenIds = nftNode?.PreviousFields?.NonFungibleTokens?.map(
    token => token?.NonFungibleToken?.TokenID
  );
  const previousTokenIdSet = new Set(previousTokenIds);
  const finalTokenIds = (nftNode.FinalFields ?? nftNode.NewFields)?.NonFungibleTokens?.map(
    token => token?.NonFungibleToken?.TokenID
  );
  const tokenID = finalTokenIds.find(tid => !previousTokenIdSet.has(tid));

  return {
    tokenID,
    tokenTaxon: tx.TokenTaxon,
    uri: utils.convertHexToString(tx.URI),
  };
};
