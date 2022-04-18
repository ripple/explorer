const utils = require('../utils');

module.exports = (tx, meta) => {
  const affectedNode = meta.AffectedNodes.find(
    node =>
      node?.CreatedNode?.LedgerEntryType === 'NFTokenPage' ||
      node?.ModifiedNode?.LedgerEntryType === 'NFTokenPage'
  );
  const nftNode = affectedNode.CreatedNode ?? affectedNode.ModifiedNode;

  const previousTokenIds = nftNode?.PreviousFields?.NFTokens?.map(
    token => token?.NFToken?.NFTokenID
  );
  const previousTokenIdSet = new Set(previousTokenIds);
  const finalTokenIds = (nftNode.FinalFields ?? nftNode.NewFields)?.NFTokens?.map(
    token => token?.NFToken?.NFTokenID
  );
  const tokenID = finalTokenIds.find(tid => !previousTokenIdSet.has(tid));

  return {
    tokenID,
    tokenTaxon: tx.NFTokenTaxon,
    uri: utils.convertHexToString(tx.URI),
  };
};
