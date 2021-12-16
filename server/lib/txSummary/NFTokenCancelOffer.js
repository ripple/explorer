const formatAmount = require('./formatAmount');

module.exports = (tx, meta) => {
  const cancelledOffers = meta.AffectedNodes.filter(
    node => node.DeletedNode?.LedgerEntryType === 'NFTokenOffer'
  ).map(node => ({
    offerID: node.DeletedNode.LedgerIndex,
    amount: formatAmount(node.DeletedNode.FinalFields.Amount),
    tokenID: node.DeletedNode.FinalFields.TokenID,
    offerer: node.DeletedNode.FinalFields.Owner,
  }));

  return {
    cancelledOffers,
  };
};
