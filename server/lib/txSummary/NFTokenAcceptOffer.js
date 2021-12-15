const formatAmount = require('./formatAmount');

module.exports = (tx, meta) => {
  const acceptedOfferNode = meta.AffectedNodes.find(
    node => node.DeletedNode != null && node.DeletedNode.LedgerEntryType === 'NFTokenOffer'
  ).DeletedNode;

  const amount = formatAmount(acceptedOfferNode.FinalFields.Amount);
  const tokenID = acceptedOfferNode.FinalFields.TokenID;
  const offerer = acceptedOfferNode.FinalFields.Owner;
  const accepter = tx.Account;
  const isSellOffer = acceptedOfferNode.FinalFields.Flags & (1 !== 0);
  const seller = isSellOffer ? offerer : accepter;
  const buyer = isSellOffer ? accepter : offerer;

  return {
    amount,
    tokenID,
    seller,
    buyer,
  };
};
