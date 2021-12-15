const formatAmount = require('./formatAmount');

module.exports = (tx, meta) => {
  const cancelledOffersRaw = meta.AffectedNodes.filter(
    node => node.DeletedNode != null && node.DeletedNode.LedgerEntryType === 'NFTokenOffer'
  ).map(node => node.DeletedNode.FinalFields);

  const cancelledOffers = cancelledOffersRaw.map(offer => {
    return {
      amount: formatAmount(offer.Amount),
      tokenID: offer.TokenID,
      owner: offer.Owner,
    };
  });

  return {
    cancelledOffers,
  };
};
